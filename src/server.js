require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path"); // Add this at the top
const { Server } = require("socket.io");
const whatsappService = require("./services/whatsappService");
const messageRoutes = require("./routes/messageRoutes");
const logger = require("./config/logger");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
// 1. Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "../public")));

// Custom Request Logger Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/v1", messageRoutes);

// Health Check
app.get("/health", (req, res) => res.send("Whatsapp web app is running"));

// 2. Add a route to serve the index.html on the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Global Error Handler (Must be after routes)
app.use(errorHandler);

// Initialize WhatsApp with Socket access
whatsappService.initialize(io);

server.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
