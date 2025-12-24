const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
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

    status: {
      type: String,
      enum: ["open", "claimed"],
      default: "open"
    },

   
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

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
      imageUrl: {
        type: String,
        default: null
    },
    status: {
  type: String,
  enum: ["open", "claimed"],
  default: "open"
},

claimedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

qrToken: {
  type: String,
  default: null
},

qrExpiresAt: {
  type: Date,
  default: null
},
founderContact: {
  type: String,
  default: ""
},

  },
  

  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema); 
