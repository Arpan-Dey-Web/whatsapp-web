const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const rateLimit = require("express-rate-limit");


const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per window
  message: { error: "Too many requests, please slow down." },
});

router.post("/send", apiLimiter, messageController.sendMessage);

module.exports = router;
