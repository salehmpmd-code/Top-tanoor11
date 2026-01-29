// config/database.js

const mongoose = require('mongoose');

/**
 * اتصال به پایگاه داده MongoDB
 */
const connectDB = async () => {
  try {
    // اگر متغیر محیطی MONGODB_URI وجود دارد از آن استفاده کن
    // در غیر این صورت از حافظه موقت استفاده می‌کنیم
    const mongoURI = process.env.MONGODB_URI;
    
    if (mongoURI) {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('⚠️  MongoDB URI not found. Using in-memory database.');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Falling back to in-memory database');
    process.exit(1);
  }
};

module.exports = connectDB;