const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const logger = require("../config/logger");

class WhatsAppService {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: "./sessions",
      }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
        ],
      },
    });

    this.isReady = false;
    this.queue = [];
    this.isProcessing = false;
  }

  initialize(io) {
    this.client.on("qr", async (qr) => {
      logger.info("New QR Code generated");
      const qrDataURL = await qrcode.toDataURL(qr);
      io.emit("qr_code", { src: qrDataURL, message: "Scan this QR" });
    });

    this.client.on("ready", () => {
      this.isReady = true;
      logger.info("WhatsApp Client is Ready!");
      io.emit("status", {
        connected: true,
        message: "Authenticated successfully",
      });
    });

    this.client.on("auth_failure", (msg) => {
      logger.error(`Authentication failure: ${msg}`);
      io.emit("status", { connected: false, message: "Auth failed" });
    });

    this.client.on("disconnected", (reason) => {
      this.isReady = false;
      logger.warn(`Client disconnected: ${reason}`);
      io.emit("status", { connected: false, message: "Disconnected" });

      this.client.initialize();
    });

    this.client.initialize();
  }

  
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { number, message, resolve, reject } = this.queue.shift();

    try {
      const sanitizedNum = number.replace(/\D/g, "");
      const chatId = `${sanitizedNum}@c.us`;

      logger.info(`Processing message for: ${sanitizedNum}`);
      const result = await this.client.sendMessage(chatId, message);

      resolve(result);
    } catch (error) {
      logger.error(`Queue processing error: ${error.message}`);
      reject(error);
    } finally {
      this.isProcessing = false;

      setTimeout(() => this.processQueue(), 1000);
    }
  }

  async sendMessage(number, message) {
    if (!this.isReady) {
      throw new Error(
        "WhatsApp session not active. Please scan the QR code first.",
      );
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ number, message, resolve, reject });
      this.processQueue();
    });
  }
}

module.exports = new WhatsAppService();
