const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },
  organizationType: {
  type: String,
  enum: ["college", "society"],
  default: "college"
},
societyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Society",
  default: null
}

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
