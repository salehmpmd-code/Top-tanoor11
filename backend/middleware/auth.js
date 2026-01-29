// middleware/auth.js

/**
 * میدل‌ور برای احراز هویت مدیر
 */
const authenticateAdmin = (req, res, next) => {
  try {
    // در این نسخه ساده، از Basic Auth استفاده می‌کنیم
    // در نسخه تولیدی باید از JWT یا روش امن‌تری استفاده کرد
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({
        success: false,
        message: 'دسترسی غیرمجاز. نیاز به احراز هویت است.'
      });
    }
    
    // استخراج نام کاربری و رمز عبور
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    // بررسی اعتبار
    const validUsername = process.env.ADMIN_USERNAME || 'matin';
    const validPassword = process.env.ADMIN_PASSWORD || '1025';
    
    if (username === validUsername && password === validPassword) {
      req.user = { username, role: 'admin' };
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'نام کاربری یا رمز عبور اشتباه است'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در احراز هویت'
    });
  }
};

/**
 * میدل‌ور برای اعتبارسنجی ورودی‌ها
 */
const validateMenuItem = (req, res, next) => {
  const errors = [];
  
  // بررسی نام
  if (!req.body.name || req.body.name.trim().length < 2) {
    errors.push('نام آیتم باید حداقل ۲ حرف باشد');
  }
  
  // بررسی توضیحات
  if (!req.body.description || req.body.description.trim().length < 10) {
    errors.push('توضیحات باید حداقل ۱۰ حرف باشد');
  }
  
  // بررسی قیمت
  if (!req.body.price || isNaN(req.body.price) || req.body.price < 1000) {
    errors.push('قیمت باید عددی معتبر و حداقل ۱۰۰۰ تومان باشد');
  }
  
  // بررسی دسته‌بندی
  const validCategories = ['hot-coffee', 'cold-coffee', 'tea', 'dessert', 'breakfast'];
  if (!req.body.category || !validCategories.includes(req.body.category)) {
    errors.push('دسته‌بندی معتبر نیست');
  }
  
  // بررسی تخفیف
  if (req.body.discount) {
    const discount = parseInt(req.body.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      errors.push('تخفیف باید بین ۰ تا ۱۰۰ باشد');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'خطا در اعتبارسنجی داده‌ها',
      errors
    });
  }
  
  next();
};

/**
 * میدل‌ور برای محدود کردن درخواست‌ها (Rate Limiting)
 */
const rateLimiter = (req, res, next) => {
  // یک پیاده‌سازی ساده از Rate Limiting
  // در نسخه تولیدی از کتابخانه‌ای مثل express-rate-limit استفاده کن
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 دقیقه
  const maxRequests = 100; // حداکثر ۱۰۰ درخواست در هر بازه
  
  // در این نسخه ساده فقط لاگ می‌کنیم
  console.log(`Request from ${clientIP} to ${req.method} ${req.path}`);
  
  next();
};

module.exports = {
  authenticateAdmin,
  validateMenuItem,
  rateLimiter
};