const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const { getImageEmbedding } = require("../services/clip.service");
const { cosineSimilarity } = require("../services/matching.service");

/* ======================================================
   ADD ITEM + AI MATCHING (FINAL SAFE VERSION)
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

        visionFeatures: { embedding: [] },
        matchCandidates: []
      };
      const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const duplicate = await Item.findOne({
  postedBy: req.user.userId,
  title: {
    $regex: `^${escapeRegex(req.body.title.trim())}$`,
    $options: "i"
  },
  location: {
    $regex: `^${escapeRegex(req.body.location.trim())}$`,
    $options: "i"
  },
  status: "open" // make sure this matches your schema
});

if (duplicate) {
  return res.status(409).json({
    error: "duplicate_item",
    message: "You already posted this item"
  });
}
      const item = await Item.create(itemData);

      if (!item.imageUrl) return res.json(item);

      // Generate embedding
      const embedding = await getImageEmbedding(item.imageUrl);

      await Item.updateOne(
        { _id: item._id },
        { $set: { "visionFeatures.embedding": embedding } }
      );

      const oppositeType = item.type === "lost" ? "found" : "lost";

      const filter = {
        type: oppositeType,
        status: "open"
      };

      if (item.organizationType === "college") {
        filter.collegeId = item.collegeId;
      }

      if (item.organizationType === "society") {
        filter.societyId = item.societyId;
      }

      const candidates = await Item.find(filter);
for (const candidate of candidates) {

  // ✅ ensure candidate has embedding
  if (!candidate.visionFeatures?.embedding?.length && candidate.imageUrl) {
    const emb = await getImageEmbedding(candidate.imageUrl);

    await Item.updateOne(
      { _id: candidate._id },
      { $set: { "visionFeatures.embedding": emb } }
    );

    candidate.visionFeatures.embedding = emb;
  }

  // ✅ ensure current item has embedding
  if (!item.visionFeatures?.embedding?.length && item.imageUrl) {
    const emb = await getImageEmbedding(item.imageUrl);

    await Item.updateOne(
      { _id: item._id },
      { $set: { "visionFeatures.embedding": emb } }
    );

    item.visionFeatures.embedding = emb;
  }

  // still missing embeddings → skip
  if (
    !item.visionFeatures?.embedding?.length ||
    !candidate.visionFeatures?.embedding?.length
  ) {
    continue;
  }

  const lost = item.type === "lost" ? item : candidate;
  const found = item.type === "found" ? item : candidate;

  const score = cosineSimilarity(
    lost.visionFeatures.embedding,
    found.visionFeatures.embedding
  );

  if (!Number.isFinite(score) || score < 0.75) continue;

  await Item.updateOne(
    { _id: lost._id },
    {
      $addToSet: {
        matchCandidates: {
          itemId: found._id,
          score
        }
      }
    }
  );

  await Item.updateOne(
    { _id: found._id },
    {
      $addToSet: {
        itemId: lost._id,
        score
      }
    }
  );
}



      return res.status(200).json({
   success: true,
   item
   });

    } catch (err) {
      console.error("ADD ITEM ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ======================================================
   GET ITEM BY ID
====================================================== */
router.get("/by-id/:itemId", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
      .populate("matchCandidates.itemId")
      .populate("postedBy", "name email");

    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   GET ALL ITEMS
====================================================== */
router.get("/getallitems", authMiddleware, async (req, res) => {
  try {
    const query = { organizationType: req.user.organizationType };

    if (req.user.organizationType === "college") {
      query.collegeId = req.user.collegeId;
    }

    if (req.user.organizationType === "society") {
      query.societyId = req.user.societyId;
    }

    const items = await Item.find(query)
      .populate("postedBy", "name email")
      .populate("claimedBy", "name email")
      .populate("matchCandidates.itemId") // ✅ REQUIRED
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/* ======================================================
   DELETE ITEM
====================================================== */
router.delete("/delete/:itemId", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.postedBy.toString() !== req.user.userId)
      return res.status(403).json({ error: "Not authorized" });

    await Item.updateMany(
      { "matchCandidates.itemId": item._id },
      { $pull: { matchCandidates: { itemId: item._id } } }
    );

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

    if (item.postedBy.toString() !== req.user.userId)
      return res.status(403).json({ error: "Not authorized" });

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
   VERIFY QR (GET + POST SAFE)
====================================================== */
router.get("/verify-qr", async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).json({ error: "QR token missing" });
    }

    const item = await Item.findOne({ qrToken: token });

    if (!item) {
      return res.status(404).json({ error: "QR not found or already used" });
    }

    if (item.qrExpiresAt && item.qrExpiresAt < new Date()) {
      return res.status(410).json({ error: "QR expired" });
    }

    return res.json({
      itemId: item._id,
      status: item.status
    });
  } catch (err) {
    console.error("VERIFY QR ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
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

    if (item.status === "claimed") {
      return res.status(400).json({ error: "Item already claimed" });
    }

    // ✅ SAVE WHO CLAIMED IT
    item.status = "claimed";
    item.claimedBy = req.user.userId;
    item.qrToken = null;
    item.qrExpiresAt = null;

    await item.save();

    // cleanup matching references
    await Item.updateMany(
      { "matchCandidates.itemId": item._id },
      { $pull: { matchCandidates: { itemId: item._id } } }
    );

    res.json({ message: "Item successfully claimed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



/* ======================================================
   MY ITEMS
====================================================== */
router.get("/my-posted", authMiddleware, async (req, res) => {
 const items = await Item.find({ postedBy: req.user.userId })
  .populate("matchCandidates.itemId")
  .sort({ createdAt: -1 });

  res.json(items);
});

router.get("/my-claimed", authMiddleware, async (req, res) => {
  const items = await Item.find({ claimedBy: req.user.userId })
    .populate("postedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(items);
});


module.exports = router;
