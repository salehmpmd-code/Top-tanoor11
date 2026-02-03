// server.js

// ==================== بارگذاری متغیرهای محیطی ====================
require('dotenv').config();

// ==================== وارد کردن ماژول‌ها ====================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// ==================== فایل‌های پروژه ====================
const connectDB = require('./config/database');
const menuRoutes = require('./routes/menuRoutes');

// ==================== ایجاد اپ ====================
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== میدل‌ورها ====================

// امنیت
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  })
);

// لاگ
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== CORS ====================
const allowedOrigins = [
  'https://salehmpmd-code.github.io'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// ==================== دیتابیس (ایمن برای Deploy) ====================
if (process.env.MONGO_URI) {
  connectDB();
  console.log('✅ MongoDB متصل شد');
} else {
  console.warn('⚠️ MONGO_URI ست نشده — دیتابیس غیرفعال است');
}

// ==================== فایل‌های استاتیک (اختیاری) ====================
// فقط اگر واقعاً فرانت داخل همین پروژه داری
app.use(express.static(path.join(__dirname, 'frontend')));

// ==================== مسیرهای API ====================
app.use('/api', menuRoutes);

// ==================== مسیر اصلی ====================
app.get('/', (req, res) => {
  res.json({
    message: 'به API منوی کافه خوش آمدید',
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      menu: '/api/menu-items',
      docs: '/api-docs'
    }
  });
});

// ==================== مستندات API ====================
app.get('/api-docs', (req, res) => {
  res.json({
    title: 'Cafe Menu API',
    version: '1.0.0',
    baseURL: process.env.API_BASE_URL || `http://localhost:${PORT}`,
    auth: {
      type: 'Basic Auth',
      username: process.env.ADMIN_USERNAME || 'matin'
    }
  });
});

// ==================== 404 ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `مسیر ${req.originalUrl} یافت نشد`
  });
});

// ==================== Error handler ====================
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'خطای داخلی سرور'
        : err.message
  });
});

// ==================== اجرای سرور ====================
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server is running
📍 Port: ${PORT}
🌍 Env: ${process.env.NODE_ENV || 'development'}
🕒 Time: ${new Date().toLocaleString('fa-IR')}
  `);
});

// ==================== Graceful shutdown ====================
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
