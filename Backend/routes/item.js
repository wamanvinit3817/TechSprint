const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// 🤖 AI SERVICES (NEW)
const { analyzeImage } = require("../services/vision.service");
const { matchScore } = require("../services/matching.service");

/* ======================================================
   ADD ITEM (LOST / FOUND)
====================================================== */
router.post(
  "/additem",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const itemData = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        location: req.body.location,

        // org scoping
        organizationType: req.user.organizationType,
        collegeId: req.user.collegeId || null,
        societyId: req.user.societyId || null,

        // ownership
        postedBy: req.user.userId,

        // image
        imageUrl: req.file ? req.file.path : null,

        // contact only for found
        founderContact:
          req.body.type === "found"
            ? req.body.founderContact
            : ""
      };

      // 🔹 CREATE ITEM (EXISTING LOGIC)
      const item = await Item.create(itemData);

      /* ======================================================
         🤖 AI IMAGE ANALYSIS (NEW, NON-BREAKING)
      ====================================================== */
      if (item.imageUrl) {
        // 1️⃣ Extract features
        item.visionFeatures = await analyzeImage(item.imageUrl);
        await item.save();

        // 2️⃣ Find opposite type items
        const oppositeType = item.type === "lost" ? "found" : "lost";

        const candidates = await Item.find({
          type: oppositeType,
          organizationType: item.organizationType,
          collegeId: item.collegeId || null,
          societyId: item.societyId || null,
          status: "open"
        });

        // 3️⃣ Compare & store matches (ONLY on LOST items)
        for (const candidate of candidates) {
          if (!candidate.visionFeatures) continue;

          const lostItem = item.type === "lost" ? item : candidate;
          const foundItem = item.type === "found" ? item : candidate;

          if (!lostItem || !foundItem) continue;

          const score = matchScore(
            lostItem.visionFeatures,
            foundItem.visionFeatures
          );

          if (score >= 0.7) {
            lostItem.matchCandidates.push({
              itemId: foundItem._id,
              score
            });

            await lostItem.save();
          }
        }
      }

      res.json(item);
    } catch (err) {
      console.error("❌ ADD ITEM ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ======================================================
   GET ALL ITEMS (ORG SCOPED)
====================================================== */
router.get("/getallitems", authMiddleware, async (req, res) => {
  try {
    const query = {
      organizationType: req.user.organizationType
    };

    if (req.user.organizationType === "college") {
      query.collegeId = req.user.collegeId;
    }

    if (req.user.organizationType === "society") {
      query.societyId = req.user.societyId;
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name email");

    res.json(items);
  } catch (err) {
    console.error("❌ Fetch items error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   QR GENERATION (UNCHANGED)
====================================================== */
router.post("/generate-qr/:itemId", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) return res.status(404).json({ error: "Item not found" });
    if (item.status === "claimed")
      return res.status(400).json({ error: "Item already claimed" });

    // only finder can generate QR
    if (item.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const qrToken = crypto.randomUUID();

    item.qrToken = qrToken;
    item.qrExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await item.save();

    res.json({ qrToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   VERIFY QR (UNCHANGED)
====================================================== */
router.post("/verify-qr", async (req, res) => {
  try {
    const { qrToken } = req.body;

    const item = await Item.findOne({ qrToken });
    if (!item) return res.status(400).json({ error: "Invalid QR" });
    if (item.qrExpiresAt < new Date())
      return res.status(400).json({ error: "QR expired" });

    res.json({
      message: "QR valid",
      itemId: item._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   FINAL CLAIM (UNCHANGED)
====================================================== */
router.post("/final-claim", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await Item.findById(itemId);

    if (!item) return res.status(404).json({ error: "Item not found" });
    if (item.status === "claimed")
      return res.status(400).json({ error: "Item already claimed" });

    if (item.postedBy.toString() === req.user.userId) {
      return res.status(403).json({ error: "Cannot claim your own item" });
    }

    item.status = "claimed";
    item.claimedBy = req.user.userId;
    item.qrToken = null;
    item.qrExpiresAt = null;

    await item.save();
    res.json({ message: "Item successfully claimed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   MY POSTED ITEMS
====================================================== */
router.get("/my-posted", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({
      postedBy: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   MY CLAIMED ITEMS
====================================================== */
router.get("/my-claimed", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({
      claimedBy: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
