const jwt = require("jsonwebtoken");

// Middleware to verify token and check isAdmin
exports.verifyAdminToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res
        .status(403)
        .json({
          message: "Access denied. Unauthorized!",
          decodedData: decoded,
        });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
