const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const serverless = require("serverless-http");

const connectDB = require("./config/db");

// Import all routes
const userRoutes = require("./routes/user.route");
const adminRoutes = require("./routes/admin.route");
const unitRoutes = require("./routes/unit.route");
const leaseRoutes = require("./routes/lease.route");
const bookingRoutes = require("./routes/booking.route");
const maintenanceRoutes = require("./routes/maintenance.route");
const notificationRoutes = require("./routes/notification.route");
const reviewRoutes = require("./routes/review.route");

const app = express();

// Enhanced DB connection with error handling
connectDB().catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Improved CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://test-leasemate-frontend.vercel.app",
  "https://test-backendleasemate-zeta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    documentation: "All routes are prefixed with /api",
    endpoints: [
      "/api/users",
      "/api/admin",
      "/api/units",
      "/api/leases",
      "/api/booking",
      "/api/maintenance",
      "/api/notifications",
      "/api/reviews",
    ],
  });
});

// Register all routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/leases", leaseRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.stack);
  res.status(err.statusCode || 500).json({
    status: err.statusText || "ERROR",
    message: err.message || "Internal Server Error",
    code: err.statusCode || 500,
    data: null,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler with more details
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    attemptedPath: req.originalUrl,
    availableEndpoints: [
      "/api/users",
      "/api/admin",
      "/api/units",
      "/api/leases",
      "/api/booking",
      "/api/maintenance",
      "/api/notifications",
      "/api/reviews",
    ],
    documentation: "All routes require /api prefix",
  });
});

// Serverless/Local execution
if (process.env.VERCEL) {
  module.exports = app;
  module.exports.handler = serverless(app, {
    binary: ["image/*", "application/pdf", "application/octet-stream"],
  });
} else {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🔗 Try http://localhost:${port}/api/users`);
  });

  process.on("SIGINT", () => {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}
