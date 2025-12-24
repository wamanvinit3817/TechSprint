const express = require("express");
const router = express.Router();

const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");


const upload = require("../middleware/upload");

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

        // ✅ org scoping
        organizationType: req.user.organizationType,
        collegeId: req.user.collegeId || null,
        societyId: req.user.societyId || null,

        // ✅ ownership
        postedBy: req.user.userId,

        // ✅ image
        imageUrl: req.file ? req.file.path : null,

        // ✅ contact info ONLY for found
        founderContact:
          req.body.type === "found"
            ? req.body.founderContact
            : ""
      };

      const item = await Item.create(itemData);
      res.json(item);

    } catch (err) {
      console.error("❌ ADD ITEM ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);




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

const crypto = require("crypto");


router.post("/generate-qr/:itemId", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.status === "claimed") {
      return res.status(400).json({ error: "Item already claimed" });
    }

    // Only finder can generate QR
    if (item.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const qrToken = crypto.randomUUID();

    item.qrToken = qrToken;
    item.qrExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await item.save();

    res.json({
      qrToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify-qr", async (req, res) => {
  try {
    const { qrToken } = req.body;

    const item = await Item.findOne({ qrToken });

    if (!item) {
      return res.status(400).json({ error: "Invalid QR" });
    }

    if (item.qrExpiresAt < new Date()) {
      return res.status(400).json({ error: "QR expired" });
    }

    res.json({
      message: "QR valid",
      itemId: item._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/final-claim", authMiddleware, async (req, res) => {
  try {
    console.log("🔥 FINAL CLAIM ROUTE HIT");
     console.log("REQ BODY:", req.body);
  console.log("REQ USER:", req.user);
    const { itemId } = req.body;

    const item = await Item.findById(itemId);
 
    console.log("ITEM FOUND:", item);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 🚫 HARD STOP
    if (item.status === "claimed") {
      return res.status(400).json({ error: "Item already claimed" });
    }

    // 🚫 Prevent self-claim
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

// 🔹 My Posted Items
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

// 🔹 My Claimed Items
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
