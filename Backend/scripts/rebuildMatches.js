const mongoose = require("mongoose");
const Item = require("../models/Item");
const { cosineSimilarity } = require("../services/matching.service");
require("dotenv").config();

function dedupeByItemId(arr) {
  const map = new Map();
  for (const obj of arr) {
    map.set(String(obj.itemId), obj);
  }
  return Array.from(map.values());
}

async function rebuildMatches() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to DB");

  const items = await Item.find({ status: "open" });

  console.log("📦 Items found:", items.length);

  for (const item of items) {
    if (!item.visionFeatures?.embedding?.length) continue;

    const oppositeType = item.type === "lost" ? "found" : "lost";

    let filter = {
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

    let updatedMatches = [];

    for (const candidate of candidates) {
      if (!candidate.visionFeatures?.embedding?.length) continue;

      const lost = item.type === "lost" ? item : candidate;
      const found = item.type === "found" ? item : candidate;

      const score = cosineSimilarity(
        lost.visionFeatures.embedding,
        found.visionFeatures.embedding
      );

      if (score < 0.75) continue;

      updatedMatches.push({
        itemId: found._id,
        score
      });

      // Also update reverse direction
      const reverseMatches = candidate.matchCandidates || [];
      const mergedReverse = dedupeByItemId([
        ...reverseMatches,
        { itemId: item._id, score }
      ]);

      await Item.updateOne(
        { _id: candidate._id },
        { $set: { matchCandidates: mergedReverse } }
      );
    }

    // Deduplicate + save main item
    const merged = dedupeByItemId([
      ...(item.matchCandidates || []),
      ...updatedMatches
    ]);

    await Item.updateOne(
      { _id: item._id },
      { $set: { matchCandidates: merged } }
    );
  }

  console.log("✅ Matches rebuilt cleanly (no duplicates)");
  process.exit(0);
}

rebuildMatches().catch(err => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});
