const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const serverless = require("serverless-http");

const connectDB = require("./config/db");

// Import all routes
const routes = [
  require("./routes/user.route"),
  require("./routes/admin.route"),
  require("./routes/unit.route"),
  require("./routes/lease.route"),
  require("./routes/booking.route"),
  require("./routes/maintenance.route"),
  require("./routes/notification.route"),
  require("./routes/review.route"),
];

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (ensure 'uploads' folder exists in your project root)
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
app.use("/api/users", routes[0]);
app.use("/api/admin", routes[1]);
app.use("/api/units", routes[2]);
app.use("/api/leases", routes[3]);
app.use("/api/booking", routes[4]);
app.use("/api/maintenance", routes[5]);
app.use("/api/notifications", routes[6]);
app.use("/api/reviews", routes[7]);

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
      // List all available endpoints
    ],
    documentation: "All routes require /api prefix",
  });
});

// Serverless/Local execution
if (process.env.VERCEL_ENV) {
  module.exports = app;
  module.exports.handler = serverless(app);
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
