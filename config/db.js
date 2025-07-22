const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 ثواني بدلاً من 30
      socketTimeoutMS: 45000, // 45 ثانية
      connectTimeoutMS: 30000, // 30 ثانية
      maxPoolSize: 10 // تقليل عدد الاتصالات
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;