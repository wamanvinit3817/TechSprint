const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// 🤖 CLIP (LOCAL AI)
const { getImageEmbedding } = require("../services/clip.service");
const { cosineSimilarity } = require("../services/matching.service");

/* ======================================================
   ADD ITEM (LOST / FOUND) + AI MATCHING
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
        category: req.body.category,
        type: req.body.type,
        location: req.body.location,

        organizationType: req.user.organizationType,
        collegeId: req.user.collegeId || null,
        societyId: req.user.societyId || null,

        postedBy: req.user.userId,
        imageUrl: req.file ? req.file.path : null,

        founderContact:
          req.body.type === "found" ? req.body.founderContact : "",

        // ✅ defaults (IMPORTANT)
        visionFeatures: { embedding: [] },
        matchCandidates: []
      };

      // 1️⃣ Create item
      const item = await Item.create(itemData);

      /* ================= CLIP AI MATCHING ================= */
      if (item.imageUrl) {
        // Generate embedding
        const embedding = await getImageEmbedding(item.imageUrl);
        item.visionFeatures = { embedding };
        await item.save();

        const oppositeType = item.type === "lost" ? "found" : "lost";

        const candidates = await Item.find({
          type: oppositeType,
          organizationType: item.organizationType,
          collegeId: item.collegeId || null,
          societyId: item.societyId || null,
          status: "open"
        });

        for (const c of candidates) {
          if (!c.visionFeatures?.embedding?.length) continue;

          const lostItem = item.type === "lost" ? item : c;
          const foundItem = item.type === "found" ? item : c;

          const score = cosineSimilarity(
            lostItem.visionFeatures.embedding,
            foundItem.visionFeatures.embedding
          );

          console.log("🧠 MATCH SCORE:", score);

          if (score >= 0.75) {
            if (!lostItem.matchCandidates) {
              lostItem.matchCandidates = [];
            }

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
   GET ITEM BY ID (FOR MATCH VIEW FROM MY ITEMS)
====================================================== */
router.get("/by-id/:itemId", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
      .populate("postedBy", "name email");

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


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
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   DELETE ITEM (CLEAN MATCH REFERENCES)
====================================================== */
router.delete("/delete/:itemId", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // only owner can delete
    if (item.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // 🔥 REMOVE THIS ITEM FROM ALL MATCH CANDIDATES
    await Item.updateMany(
      { "matchCandidates.itemId": item._id },
      { $pull: { matchCandidates: { itemId: item._id } } }
    );

    // delete item itself
    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ======================================================
   GENERATE QR
====================================================== */
router.post("/generate-qr/:itemId", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) return res.status(404).json({ error: "Item not found" });
    if (item.status === "claimed")
      return res.status(400).json({ error: "Item already claimed" });

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
   VERIFY QR
====================================================== */
router.post("/verify-qr", async (req, res) => {
  try {
    const { qrToken } = req.body;

    const item = await Item.findOne({ qrToken });
    if (!item) return res.status(400).json({ error: "Invalid QR" });
    if (item.qrExpiresAt < new Date())
      return res.status(400).json({ error: "QR expired" });

    res.json({ itemId: item._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   FINAL CLAIM
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
