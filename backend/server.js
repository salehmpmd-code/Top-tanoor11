// server.js

// بارگذاری متغیرهای محیطی
require('dotenv').config();

// وارد کردن ماژول‌های مورد نیاز
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// وارد کردن فایل‌های پروژه
const connectDB = require('./config/database');
const menuRoutes = require('./routes/menuRoutes');
const { seed } = require('./data/seedData');

// ایجاد برنامه Express
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== میدل‌ورها ====================

// امنیت با Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// لاگ‌گیری با Morgan
app.use(morgan('dev'));

// پردازش JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // در حالت توسعه، همه درخواست‌ها مجازند
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      // در حالت تولید، فقط دامنه‌های مجاز
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'https://salehmpmd-code.github.io'
      ];
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ==================== اتصال به پایگاه داده ====================

connectDB();

// ==================== مسیرهای استاتیک ====================

// سرو کردن فایل‌های فرانت‌اند (اگر از همان سرور استفاده می‌کنیم)
app.use(express.static(path.join(__dirname, '../frontend')));

// ==================== مسیرهای API ====================

// مسیر اصلی API
app.use('/api', menuRoutes);

// ==================== مسیرهای عمومی ====================

// صفحه اصلی
app.get('/', (req, res) => {
  res.json({
    message: 'به API منوی کافه Coffee Lab خوش آمدید!',
    version: '1.0.0',
    endpoints: {
      menu: '/api/menu-items',
      categories: '/api/menu-items/category/:category',
      search: '/api/menu-items/search',
      specialOffer: '/api/special-offer',
      health: '/api/health',
      stats: '/api/menu-items/stats'
    },
    documentation: 'برای مستندات کامل، به /api-docs مراجعه کنید.'
  });
});

// مستندات API
app.get('/api-docs', (req, res) => {
  res.json({
    title: 'مستندات API منوی کافه',
    description: 'API برای مدیریت منوی کافه Coffee Lab',
    baseURL: process.env.API_BASE_URL || `http://localhost:${PORT}`,
    endpoints: [
      {
        method: 'GET',
        path: '/api/menu-items',
        description: 'دریافت تمام آیتم‌های منو',
        authentication: 'بدون نیاز',
        queryParams: 'ندارد'
      },
      {
        method: 'GET',
        path: '/api/menu-items/category/{category}',
        description: 'دریافت آیتم‌های یک دسته‌بندی خاص',
        authentication: 'بدون نیاز',
        pathParams: '{category}: hot-coffee, cold-coffee, tea, dessert, breakfast'
      },
      {
        method: 'POST',
        path: '/api/menu-items',
        description: 'افزودن آیتم جدید به منو',
        authentication: 'نیاز دارد (Basic Auth)',
        body: 'JSON object با فیلدهای name, description, price, category, discount, tags, rating, image'
      },
      {
        method: 'DELETE',
        path: '/api/menu-items/{id}',
        description: 'حذف آیتم از منو',
        authentication: 'نیاز دارد (Basic Auth)'
      },
      {
        method: 'GET',
        path: '/api/special-offer',
        description: 'دریافت پیشنهاد ویژه',
        authentication: 'بدون نیاز'
      },
      {
        method: 'PUT',
        path: '/api/special-offer',
        description: 'به‌روزرسانی پیشنهاد ویژه',
        authentication: 'نیاز دارد (Basic Auth)',
        body: '{ offer: "متن جدید" }'
      }
    ],
    authentication: {
      type: 'Basic Authentication',
      username: process.env.ADMIN_USERNAME || 'matin',
      password: process.env.ADMIN_PASSWORD || '1025',
      header: 'Authorization: Basic ' + Buffer.from('username:password').toString('base64')
    }
  });
});

// ==================== مدیریت خطاها ====================

// 404 - مسیر پیدا نشد
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `مسیر ${req.originalUrl} یافت نشد`,
    suggestion: 'برای مشاهده مسیرهای موجود، به / مراجعه کنید.'
  });
});

// خطاهای سرور
app.use((err, req, res, next) => {
  console.error('🚨 خطای سرور:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'خطای داخلی سرور' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ==================== راه‌اندازی سرور ====================

const startServer = async () => {
  try {
    // بارگذاری داده‌های اولیه
    await seed();
    
    // شروع سرور
    const server = app.listen(PORT, () => {
      console.log(`
  🚀 سرور منوی کافه راه‌اندازی شد!
  
  📍 آدرس‌های مهم:
     سرور: http://localhost:${PORT}
     API: http://localhost:${PORT}/api
     مستندات: http://localhost:${PORT}/api-docs
     فرانت‌اند: http://localhost:5500/frontend/
  
  📊 وضعیت سیستم:
     پورت: ${PORT}
     محیط: ${process.env.NODE_ENV || 'development'}
     زمان: ${new Date().toLocaleString('fa-IR')}
  
  🔧 برای توقف سرور: Ctrl + C
      `);
    });
    
    // مدیریت خروج گراس‌فول
    process.on('SIGTERM', () => {
      console.log('👋 دریافت SIGTERM. بستن سرور...');
      server.close(() => {
        console.log('✅ سرور بسته شد');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ خطا در راه‌اندازی سرور:', error);
    process.exit(1);
  }
};
// شروع برنامه
startServer();

module.exports = app; // برای تست‌ها
```

---

🎯 خلاصه و دستورالعمل نصب

مراحل نصب:

1. ایجاد پوشه‌ها و فایل‌ها:
   ```bash
   mkdir -p backend/{models,routes,controllers,middleware,config,data}
   ```
2. نصب وابستگی‌ها:
   ```bash
   cd backend
   npm install
   ```
3. تنظیم متغیرهای محیطی:
   ```bash
   cp .env.example .env
   # ویرایش فایل .env با اطلاعات خود
   ```
4. راه‌اندازی سرور:
   ```bash
   npm run dev  # حالت توسعه
   # یا
   npm start    # حالت تولید
   ```

تست API:

1. بررسی سلامت سرور:
   ```
   GET http://localhost:3000/api/health
   ```
2. دریافت منو:
   ```
   GET http://localhost:3000/api/menu-items
   ```
3. افزودن آیتم جدید:
   ```
   POST http://localhost:3000/api/menu-items
   Headers: 
     Authorization: Basic bWF0aW46MTAyNQ==  # (matin:1025 به صورت base64)
     Content-Type: application/json
   
   Body:
   {
     "name": "آمریکانو",
     "description": "اسپرسو با آب داغ",
     "price": 40000,
     "category": "hot-coffee",
     "discount": 5,
     "tags": ["کلاسیک", "ساده"]
   }