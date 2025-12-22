const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    console.log(" AUTH USER:", {
      userId: data.userId,
      organizationType: data.organizationType,
      collegeId: data.collegeId || null,
      societyId: data.societyId || null
    });
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
