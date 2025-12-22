const requireSocietyUser = (req, res, next) => {
  if (req.user.organizationType !== "society") {
    return res.status(403).json({
      error: "Society members only."
    });
  }

  if (!req.user.societyId) {
    return res.status(403).json({
      error: "Invalid society user."
    });
  }

  next();
};

module.exports = requireSocietyUser;
