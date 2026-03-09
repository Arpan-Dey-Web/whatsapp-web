const whatsappService = require("../services/whatsappService");
const logger = require("../config/logger");

exports.sendMessage = async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res
      .status(400)
      .json({ success: false, error: "Number and message are required" });
  }

  try {
    const result = await whatsappService.sendMessage(number, message);
    logger.info(`Message sent to ${number}`);
    res.status(200).json({ success: true, messageId: result.id.id });
  } catch (error) {
    logger.error(`Failed to send to ${number}: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};
