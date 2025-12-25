const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");

router.get("/whoami", requireAuth, (req, res) => {
  console.log("👤 CURRENT USER:", req.user);
  res.json(req.user);
});

module.exports = router;
