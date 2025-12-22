const requireCollegeUser = (req, res, next) => {
  if (req.user.organizationType !== "college") {
    return res.status(403).json({
      error: "College users only."
    });
  }

  if (!req.user.collegeId) {
    return res.status(403).json({
      error: "Invalid college user."
    });
  }

  next();
};

module.exports = requireCollegeUser;
