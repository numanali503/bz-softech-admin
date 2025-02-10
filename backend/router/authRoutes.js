const express = require("express");
const { adminLogin, adminRegister } = require("../controllers/authController");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

const router = express.Router();
router.route("/register").post(apiKeyMiddleware, adminRegister);
router.route("/login").post(adminLogin);
router
  .route("/protected")
  .get(verifyAdminToken, (req, res) =>
    res.json({ message: "Welcome to BZ-Softech" })
  );

module.exports = router;
