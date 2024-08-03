import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { initializeSocket } from "./socket";
import { FRONTEND_URL, PORT } from "./config/env";
import { webhookHandler } from "./utils/webhookHandler";
import bodyParser from "body-parser";

const app = express();

const frontendUrl = FRONTEND_URL;

// Middleware
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(express.json()); // JSON body parser for general routes
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API running!");
});

// Webhook route with raw body parser
app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  webhookHandler
);

// Create and start server
const server = createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
