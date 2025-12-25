

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const College = require("../models/College");
const CollegeDomain = require("../models/CollegeDomain");
const Society = require("../models/Society");
const SocietyInvite = require("../models/SocietyInvite");
const CollegeInvite = require("../models/CollegeInvite");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let societyCode = null;
        let collegeCode = null;

        if (req.query.state) {
          try {
            const parsed = JSON.parse(req.query.state);
            societyCode = parsed.societyCode || null;
            collegeCode = parsed.collegeCode || null;
          } catch (e) {
            societyCode = null;
            collegeCode = null;
          }
        }

        const email = profile.emails[0].value.toLowerCase().trim();

        if (societyCode) {
          const invite = await SocietyInvite.findOne({
            code: societyCode,
            active: true,
          });

          if (!invite) {
            return done(null, false, { message: "invalid_society_code" });
          }

          const society = await Society.findById(invite.societyId);

          if (!society || society.status !== "active") {
            return done(null, false, { message: "inactive_society" });
          }

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              organizationType: "society",
              societyId: society._id,
              collegeId: null,
              verified: true,
            });
          } else {
            user.organizationType = "society";
            user.societyId = society._id;
            user.collegeId = null;
            user.verified = true;
            await user.save();
          }

          const token = jwt.sign(
            {
              userId: user._id.toString(),
              organizationType: user.organizationType,
              collegeId: user.collegeId || null,
              societyId: user.societyId || null,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );

          return done(null, { token });
        }

        if (collegeCode) {
          const invite = await CollegeInvite.findOne({
            code: collegeCode,
            active: true,
          });

          if (!invite) {
            return done(null, false, { message: "invalid_college_code" });
          }

          const college = await College.findById(invite.collegeId);

          if (!college || college.status !== "active") {
            return done(null, false, { message: "inactive_college" });
          }

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              organizationType: "college",
              collegeId: college._id,
              societyId: null,
              verified: true,
            });
          } else {
            user.organizationType = "college";
            user.collegeId = college._id;
            user.societyId = null;
            user.verified = true;
            await user.save();
          }

          const token = jwt.sign(
            {
              userId: user._id.toString(),
              organizationType: user.organizationType,
              collegeId: user.collegeId || null,
              societyId: user.societyId || null,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );

          return done(null, { token });
        }

        const domain = email.split("@")[1];

        const domainEntry = await CollegeDomain.findOne({
          domain,
          verified: true,
        });

        if (!domainEntry) {
          return done(null, false, { message: "invalid_college_domain" });
        }

        const college = await College.findById(domainEntry.collegeId);

        if (!college || college.status !== "active") {
          return done(null, false, { message: "inactive_college" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            organizationType: "college",
            collegeId: college._id,
            societyId: null,
            verified: true,
          });
        } else {
          user.organizationType = "college";
          user.collegeId = college._id;
          user.societyId = null;
          user.verified = true;
          await user.save();
        }

        const token = jwt.sign(
          {
            userId: user._id.toString(),
            organizationType: user.organizationType,
            collegeId: user.collegeId || null,
            societyId: user.societyId || null,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        return done(null, { token });
      } catch (err) {
        console.error("❌ PASSPORT ERROR:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
