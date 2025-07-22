// const express = require('express');
// require('dotenv').config();
// const cors = require('cors');
// const connectDB = require('./config/db');
// const path = require('path');
// const http = require('http');

// const userRoutes = require('./routes/user.route');
// const adminRoutes = require('./routes/admin.route');
// const unitRoutes = require('./routes/unit.route');
// const leaseRoutes = require('./routes/lease.route');
// const bookingRoutes = require('./routes/booking.route');
// const maintenanceRoutes = require('./routes/maintenance.route');
// const notificationRoutes = require('./routes/notification.route');
// const reviewRoutes = require('./routes/review.route');

// const { startLeaseExpiryJob } = require('./utils/leaseExpiryJob');

// const app = express();
// const server = http.createServer(app);

// // === Uncomment when WebSocket is needed ===
// // const socketIo = require('socket.io');
// // const { setupSocket } = require('./socket');
// // const io = socketIo(server, {
// //   cors: {
// //     origin: ["http://localhost:3000", "https://your-frontend-domain"],
// //     credentials: true,
// //   },
// // });
// // setupSocket(io);
// // app.set('io', io);
// app.set('io', null);

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://your-frontend-domain'], // replace in prod
//   credentials: true,
// }));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/units', unitRoutes);
// app.use('/api/leases', leaseRoutes);
// app.use('/api/booking', bookingRoutes);
// app.use('/api/maintenance', maintenanceRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/reviews', reviewRoutes);

// // Start scheduled tasks
// startLeaseExpiryJob();

// // Error handler
// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     status: err.statusText || 'ERROR',
//     message: err.message || 'Internal Server Error',
//     code: err.statusCode || 500,
//     data: null,
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const serverless = require('serverless-http');

const connectDB = require('./config/db');

const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const unitRoutes = require('./routes/unit.route');
const leaseRoutes = require('./routes/lease.route');
const bookingRoutes = require('./routes/booking.route');
const maintenanceRoutes = require('./routes/maintenance.route');
const notificationRoutes = require('./routes/notification.route');
const reviewRoutes = require('./routes/review.route');

// init app
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain'], // Edit this
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText || 'ERROR',
    message: err.message || 'Internal Server Error',
    code: err.statusCode || 500,
    data: null,
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export as serverless
module.exports = app;
module.exports.handler = serverless(app);
