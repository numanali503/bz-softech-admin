const express = require("express");
const router = express.Router();
const { sendReply } = require("../controllers/replyController");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

router.use(apiKeyMiddleware);

router.route("/").post(sendReply);

module.exports = router;
