const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/me", auth, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  });
});

module.exports = router;
