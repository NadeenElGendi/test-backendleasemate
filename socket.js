const Notification = require("./models/notification.model");

const onlineUsers = {};

// function setupSocket(io) {
//   io.on('connection', (socket) => {
//     console.log("✅ Socket connected:", socket.id);
//     socket.on('join', async (userId) => {
//       try {
//         onlineUsers[userId] = socket.id;
//         socket.join(userId);
//         // Send them via socket:
//         socket.emit("newNotification", notif);
//       } catch (error) {
//         console.error("❌ Error in socket join:", error);
//       }
//     });
//     socket.on('disconnect', () => {
//       console.log("❌ Socket disconnected:", socket.id);
//       if (onlineUsers[id] === socket.id) {
//         // ... existing code ...
//       }
//     });
//     socket.on('error', (error) => {
//       console.error("❌ Socket error:", error);
//     });
//   });
// }
// module.exports = { setupSocket };
