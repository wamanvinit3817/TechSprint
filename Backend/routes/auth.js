const express = require("express");
const passport = require("passport");
const router = express.Router();

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




module.exports = router;
