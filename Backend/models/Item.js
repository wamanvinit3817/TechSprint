const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

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

    location: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      default: Date.now
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["open", "claimed"],
      default: "open"
    },

    // ================= USER RELATION =================
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // ================= ORGANIZATION =================
    organizationType: {
      type: String,
      enum: ["college", "society"],
      required: true
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      default: null
    },

    // ================= IMAGE =================
    imageUrl: {
      type: String,
      default: null
    },

    // ================= FOUND ITEM CONTACT =================
    founderContact: {
      type: String,
      default: ""
    },

    // ================= QR CLAIM FLOW =================
    qrToken: {
      type: String,
      default: null
    },

    qrExpiresAt: {
      type: Date,
      default: null
    },

    // ================= CLIP AI FEATURES (NEW) =================
    visionFeatures: {
      embedding: {
        type: [Number],
        default: []
      }
    },

    // ================= MATCH RESULTS (NEW) =================
    matchCandidates: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item"
        },
        score: {
          type: Number
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
