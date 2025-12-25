const express = require("express");
const passport = require("passport");
const router = express.Router();
const College = require("../models/College")
const Society = require("../models/Society")
const User = require("../models/User")


// router.get("/google", (req, res, next) => {
//   const societyCode = req.query.societyCode;

//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
//     session: false,
//     state: societyCode
//       ? JSON.stringify({ societyCode })
//       : undefined
//   })(req, res, next);
// });
const authMiddleware = require("../middleware/authMiddleware")
router.get("/google", (req, res, next) => {
  const state = {};

  if (req.query.societyCode) {
    state.societyCode = req.query.societyCode;
  }

  if (req.query.collegeCode) {
    state.collegeCode = req.query.collegeCode;
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
    state: Object.keys(state).length ? JSON.stringify(state) : undefined
  })(req, res, next);
});


router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    (err, user, info) => {
      if (err) {
        return res.redirect("http://localhost:3000/?error=server_error");
      }

      if (!user) {
        const reason = info?.message || "unauthorized";
        return res.redirect(
          `http://localhost:3000/?error=${reason}`
        );
      }

      // success
      res.redirect(
        `http://localhost:3000/auth/success?token=${user.token}`
      );
    }
  )(req, res, next);
});


router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.organizationType) {
      return res.status(400).json({ error: "Invalid user payload" });
    }

    const user = await User.findById(req.user.userId).select("name email");

    let orgName = "";

    if (req.user.organizationType === "college") {
      const college = await College.findById(req.user.collegeId);
      orgName = college?.name || "College";
    }

    if (req.user.organizationType === "society") {
      const society = await Society.findById(req.user.societyId);
      orgName = society?.name || "Society";
    }

    res.json({
      user: {
        name: user?.name,
        email: user?.email
      },
      organization: {
        type: req.user.organizationType,
        name: orgName
      }
    });
  } catch (err) {
    console.error("❌ /auth/me ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});











module.exports = router;
