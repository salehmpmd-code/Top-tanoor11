// routes/menuRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemsByCategory,
  addMenuItem,
  deleteMenuItem,
  getSpecialOffer,
  updateSpecialOffer,
  searchMenuItems,
  getStats
} = require('../controllers/menuController');
const {
  authenticateAdmin,
  validateMenuItem,
  rateLimiter
} = require('../middleware/auth');

/**
 * @route   GET /api/menu-items
 * @desc    دریافت تمام آیتم‌های منو
 * @access  Public
 */
router.get('/menu-items', rateLimiter, getAllMenuItems);

/**
 * @route   GET /api/menu-items/category/:category
 * @desc    دریافت آیتم‌های یک دسته‌بندی خاص
 * @access  Public
 */
router.get('/menu-items/category/:category', rateLimiter, getMenuItemsByCategory);

/**
 * @route   GET /api/menu-items/search
 * @desc    جستجوی آیتم‌ها
 * @access  Public
 */
router.get('/menu-items/search', rateLimiter, searchMenuItems);

/**
 * @route   GET /api/menu-items/stats
 * @desc    دریافت آمار و گزارشات
 * @access  Private (Admin)
 */
router.get('/menu-items/stats', authenticateAdmin, getStats);

/**
 * @route   POST /api/menu-items
 * @desc    افزودن آیتم جدید به منو
 * @access  Private (Admin)
 */
router.post('/menu-items', authenticateAdmin, validateMenuItem, addMenuItem);

/**
 * @route   DELETE /api/menu-items/:id
 * @desc    حذف آیتم از منو
 * @access  Private (Admin)
 */
router.delete('/menu-items/:id', authenticateAdmin, deleteMenuItem);

/**
 * @route   GET /api/special-offer
 * @desc    دریافت پیشنهاد ویژه
 * @access  Public
 */
router.get('/special-offer', rateLimiter, getSpecialOffer);

/**
 * @route   PUT /api/special-offer
 * @desc    به‌روزرسانی پیشنهاد ویژه
 * @access  Private (Admin)
 */
router.put('/special-offer', authenticateAdmin, updateSpecialOffer);

/**
 * @route   GET /api/health
 * @desc    بررسی سلامت سرور
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'سرور در حال اجراست',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;