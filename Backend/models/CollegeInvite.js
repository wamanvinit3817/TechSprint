const mongoose = require("mongoose");

const CollegeInviteSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },

    code: {
      type: String,
      required: true,
      unique: true
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CollegeInvite", CollegeInviteSchema);
