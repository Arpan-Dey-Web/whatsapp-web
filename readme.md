# 📱 WhatsApp REST API Gateway

A **production-ready Node.js backend gateway** that integrates **WhatsApp Web** with a RESTful API.  
It provides **real-time QR authentication, persistent sessions, message queuing, and structured logging**, making it suitable for automation, integrations, and internal messaging systems.

---

# 🚀 Features

## 🧱 Modular Architecture
Clean separation using **Controllers, Services, Middleware, and Routes** to ensure maintainability and scalability.
## 🔄 Real-time QR Authentication
QR codes are streamed to the frontend **in real-time using Socket.IO**.
## 💾 Session Persistence
Uses **LocalAuth** from the WhatsApp Web client to keep sessions alive even after **server restarts**.
## ⚙️ Concurrency Handling
A **custom asynchronous in-memory queue** ensures multiple API requests are processed **sequentially**, preventing WhatsApp session crashes.
## 📊 Structured Logging
Integrated **Pino** for high-performance logging suitable for production monitoring.
## 🛡 API Security
Implemented **rate limiting** to prevent abuse or spamming of API endpoints.

---

# 🛠️ Tech Stack

| Layer                   | Technology                    |
| ----------------------- | ----------------------------- |
| Backend                 | Node.js, Express.js           |
| WhatsApp Integration    | whatsapp-web.js (Puppeteer)   |
| Real-time Communication | Socket.IO                     |
| Persistence             | Local File System (LocalAuth) |
| Logging                 | Pino, Pino-pretty             |
| Frontend                | HTML5, Tailwind CSS           |

---

# 📦 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-api.git
cd whatsapp-api
```

---

## 2️⃣ Install System Dependencies (Linux / Pop!\_OS)

Since **Puppeteer requires Chromium dependencies**, install them first:

```bash
sudo apt update
sudo apt install -y \
libgbm-dev \
wget \
unzip \
fontconfig \
locales \
libnss3 \
libatk-bridge2.0-0 \
libcups2 \
libdrm2 \
libxkbcommon0 \
libpango-1.0-0 \
libasound2
```

---

## 3️⃣ Install Project Dependencies

```bash
npm install
```

---

## 4️⃣ Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=8000
NODE_ENV=development
```

---

## 5️⃣ Run the Server

Development mode:

```bash
npm run dev
```
Production mode:

```bash
npm start
```

---

# 📲 Usage

1. Open your browser: ```http://localhost:8000```
2. Scan the **QR code** using your **WhatsApp mobile app**.
3. Once the status becomes: ```Authenticated successfully```

The API is ready to send messages.

---

# 📡 API Documentation

## Send WhatsApp Message

### Endpoint: ```POST /api/v1/send```

### Request Body:
```json
{
  "number": "8801XXXXXXXXX",
  "message": "Hello from the WhatsApp API Gateway! 🚀"
}
```

### Example Request Using cURL (Terminal)

```bash
curl -X POST http://localhost:8000/api/v1/send \
-H "Content-Type: application/json" \
-d '{
  "number": "8801XXXXXXXXX",
  "message": "Hello from API"
}'
```

---

### Example Request Using Postman

1. Open **Postman**.
2. Select **POST** as the request method.
3. Enter the URL:``` http://localhost:8000/api/v1/send```

4. Go to the **Headers** tab and add: ```Content-Type: application/json```


5. Go to the **Body** tab.
6. Select **raw** → **JSON**.
7. Add the following JSON:

```json
{
  "number": "8801XXXXXXXXX",
  "message": "Hello from the WhatsApp API Gateway!"
}
```

8. Click **Send**.

If the WhatsApp session is authenticated, the message will be delivered successfully.

---
# 🧠 Technical Highlights

## 📥 Message Queuing System

To safely handle concurrent API requests:

```
Incoming Requests
      │
      ▼
Message Queue
      │
      ▼
Sequential Processing (1 sec delay)
      │
      ▼
WhatsApp Client
```

Even if **50 requests arrive simultaneously**, they are processed **one by one**, preventing:

- Session crashes
- Rate limiting
- WhatsApp account flags

---

## 📊 Structured Logging

Using **Pino logger**:

```
-INFO  Request received
-INFO  Message queued
-INFO  Message sent successfully
-ERROR WhatsApp client disconnected

```

This makes logs **machine-readable and production-friendly**.

---

## 🛡 Security Measures

Implemented:
- express-rate-limit
- API request validation
- Error handling middleware

Example protection:

```
100 requests / 15 minutes / IP
```

---

# 📁 Project Structure

```
whatsapp-api
│
├── public/                 # Frontend UI
│   ├── index.html
│   
├── src/
│   ├── config/             # App configuration & logger
│   │   └── logger.js
│   │
│   ├── controllers/        # Request handlers
│   │   └── messageController.js
│   │
│   ├── middleware/         # Error handling & rate limiting
│   │   ├── errorHandler.js
│   │
│   ├── routes/             # API routes
│   │   └── messageRoutes.js
│   │
│   ├── services/           # Business logic
│   │   ├── whatsapp.service.js
│   │
│   └── server.js           # Application entry point
│
├── .env
├── package.json
└── README.md
```

---

# ⚠️ Important Notes

- WhatsApp may **temporarily block accounts** if too many messages are sent rapidly.
- Always implement **delays and queues** when building automation systems.
- This project **simulates human-like messaging behavior** using controlled delays.

---

# 🧪 Future Improvements

Possible upgrades:

- Redis-based distributed queue
- Web dashboard for monitoring
- Message scheduling
- Multi-session support
- Docker containerization

---

---

# 🚀 Final Git Push

```bash
git add README.md
git commit -m "docs: improve README with full documentation"
git push origin main
```
