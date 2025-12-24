const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // ✅ Extract token from "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = data;

    console.log("🔐 AUTH USER:", {
      userId: data.userId,
      organizationType: data.organizationType,
      collegeId: data.collegeId || null,
      societyId: data.societyId || null
    });

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
