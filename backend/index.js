const express = require("express");
const cors = require("cors");
const emailRouter = require("./router/emailRoutes");
const replyRoutes = require("./router/replyRoutes");
const authRoutes = require("./router/authRoutes"); // Changed from adminRoutes to authRoutes
const server = express();

const allowedOrigins = ["http://localhost:3000"];

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "x-api-key",
      "x-auth-token",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

require("dotenv").config({ path: "./config.env" });
require("./database/connection");

server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
server.use("/api/auth", authRoutes); // Changed to /api/auth since it's for authorization
server.use("/api/emails", emailRouter);
server.use("/api/replies", replyRoutes);

server.get("/", (req, res) => {
  res.status(200).send("👋Welcome to BZ-Softech Server");
});

// Error handling middleware
server.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

server.listen(process.env.PORT, () => {
  console.log(
    `🖥️  =================== Server Initiated at Port# ${process.env.PORT} =================== 🖥️`
  );
});
