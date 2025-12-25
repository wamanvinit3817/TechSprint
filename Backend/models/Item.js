const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,

  category: {
    type: String,
    enum: ["id_card", "phone", "wallet", "keys", "bag", "other"],
    default: "other"
  },

  type: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },

  location: String,

  status: {
    type: String,
    enum: ["open", "claimed"],
    default: "open"
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  organizationType: String,
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: "Society" },

  imageUrl: String,

  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  qrToken: String,
  qrExpiresAt: Date,
  founderContact: String,

  // 🔥 AI FEATURES
  visionFeatures: {
    labels: [String],
    objects: [String],
    colors: [String],
    text: [String]
  },

  // 🔔 MATCH RESULTS (stored ONLY on lost items)
  matchCandidates: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    score: Number
  }]

}, { timestamps: true });

module.exports = mongoose.model("Item", ItemSchema);
