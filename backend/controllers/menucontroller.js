// controllers/menuController.js

const MenuItem = require('../models/menuItem');
const { v4: uuidv4 } = require('uuid');

// داده‌های موقت در حافظه (اگر از MongoDB استفاده نمی‌کنیم)
let inMemoryData = {
  menuItems: [],
  specialOffer: "قهوه کلد برو با طعم کارامل - ۲۰٪ تخفیف"
};

/**
 * دریافت تمام آیتم‌های منو
 */
const getAllMenuItems = async (req, res) => {
  try {
    let items;
    
    // اگر از MongoDB استفاده می‌کنیم
    if (MenuItem.name !== 'InMemoryMenuItem') {
      items = await MenuItem.find({ isActive: true })
        .sort({ createdAt: -1 })
        .select('-__v');
    } else {
      // حالت درون‌حافظه‌ای
      items = inMemoryData.menuItems.filter(item => item.isActive !== false);
    }
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error getting menu items:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آیتم‌های منو'
    });
  }
};

/**
 * دریافت آیتم بر اساس دسته‌بندی
 */
const getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // بررسی اعتبار دسته‌بندی
    const validCategories = ['hot-coffee', 'cold-coffee', 'tea', 'dessert', 'breakfast'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'دسته‌بندی معتبر نیست'
      });
    }
    
    let items;
    
    if (MenuItem.name !== 'InMemoryMenuItem') {
      items = await MenuItem.find({ 
        category,
        isActive: true 
      }).sort({ price: 1 });
    } else {
      items = inMemoryData.menuItems.filter(
        item => item.category === category && item.isActive !== false
      );
    }
    
    res.status(200).json({
      success: true,
      count: items.length,
      category,
      data: items
    });
  } catch (error) {
    console.error('Error getting items by category:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آیتم‌های دسته‌بندی'
    });
  }
};

/**
 * افزودن آیتم جدید به منو
 */
const addMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      discount = 0,
      tags = [],
      rating = 4.5,
      image = null
    } = req.body;
    
    const newItemData = {
      name: name.trim(),
      description: description.trim(),
      price: parseInt(price),
      category,
      discount: parseInt(discount) || 0,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      rating: parseFloat(rating) || 4.5,
      image,
      isActive: true
    };
    
    let newItem;
    
    if (MenuItem.name !== 'InMemoryMenuItem') {
      newItem = new MenuItem(newItemData);
      await newItem.save();
    } else {
      // حالت درون‌حافظه‌ای
      newItemData.id = uuidv4();
      newItemData.createdAt = new Date();
      newItemData.updatedAt = new Date();
      inMemoryData.menuItems.push(newItemData);
      newItem = newItemData;
    }
    
    res.status(201).json({
      success: true,
      message: 'آیتم با موفقیت اضافه شد',
      data: newItem
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    
    // خطاهای خاص MongoDB
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'خطا در اعتبارسنجی داده‌ها',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'خطا در افزودن آیتم'
    });
  }
};

/**
 * حذف آیتم از منو
 */
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    let result;
    
    if (MenuItem.name !== 'InMemoryMenuItem') {
      // در MongoDB، آیتم را به صورت نرم حذف می‌کنیم (isActive: false)
      result = await MenuItem.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'آیتم مورد نظر یافت نشد'
        });
      }
    } else {
      // حالت درون‌حافظه‌ای
      const itemIndex = inMemoryData.menuItems.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'آیتم مورد نظر یافت نشد'
        });
      }
      
      // حذف نرم
      inMemoryData.menuItems[itemIndex].isActive = false;
      inMemoryData.menuItems[itemIndex].updatedAt = new Date();
      result = inMemoryData.menuItems[itemIndex];
    }
    
    res.status(200).json({
      success: true,
      message: 'آیتم با موفقیت حذف شد',
      data: result
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف آیتم'
    });
  }
};

/**
 * دریافت پیشنهاد ویژه
 */
const getSpecialOffer = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        offer: inMemoryData.specialOffer,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting special offer:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیشنهاد ویژه'
    });
  }
};

/**
 * به‌روزرسانی پیشنهاد ویژه
 */
const updateSpecialOffer = (req, res) => {
  try {
    const { offer } = req.body;
    
    if (!offer || offer.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'متن پیشنهاد ویژه باید حداقل ۵ حرف باشد'
      });
    }
    
    inMemoryData.specialOffer = offer.trim();
    
    res.status(200).json({
      success: true,
      message: 'پیشنهاد ویژه با موفقیت به‌روزرسانی شد',
      data: {
        offer: inMemoryData.specialOffer,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating special offer:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی پیشنهاد ویژه'
    });
  }
};

/**
 * جستجوی آیتم‌ها
 */
const searchMenuItems = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'عبارت جستجو باید حداقل ۲ حرف باشد'
      });
    }
    
    const searchTerm = q.trim();
    let items;
    
    if (MenuItem.name !== 'InMemoryMenuItem') {
      // جستجو در MongoDB
      items = await MenuItem.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $regex: searchTerm, $options: 'i' } }
        ],
        isActive: true
      });
    } else {
      // جستجو در داده‌های حافظه
      items = inMemoryData.menuItems.filter(item => 
        item.isActive !== false && (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
    
    res.status(200).json({
      success: true,
      count: items.length,
      searchTerm,
      data: items
    });
  } catch (error) {
    console.error('Error searching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در جستجوی آیتم‌ها'
    });
  }
};

/**
 * دریافت آمار و گزارشات
 */
const getStats = async (req, res) => {
  try {
    let stats;
    
    if (MenuItem.name !== 'InMemoryMenuItem') {
      // آمار از MongoDB
      const totalItems = await MenuItem.countDocuments({ isActive: true });
      const itemsByCategory = await MenuItem.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
      
      stats = {
        totalItems,
        itemsByCategory,
        averagePrice: await MenuItem.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, avgPrice: { $avg: '$price' } } }
        ]),
        lastUpdated: new Date()
      };
    } else {
      // آمار از داده‌های حافظه
      const activeItems = inMemoryData.menuItems.filter(item => item.isActive !== false);
      const totalItems = activeItems.length;
      
      const itemsByCategory = {};
      activeItems.forEach(item => {
        itemsByCategory[item.category] = (itemsByCategory[item.category] || 0) + 1;
      });
      
      const totalPrice = activeItems.reduce((sum, item) => sum + item.price, 0);
      const averagePrice = totalItems > 0 ? totalPrice / totalItems : 0;
      
      stats = {
        totalItems,
        itemsByCategory: Object.entries(itemsByCategory).map(([category, count]) => ({
          _id: category,
          count
        })),
        averagePrice: [{ avgPrice: averagePrice }],
        lastUpdated: new Date()
      };
    }
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار'
    });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemsByCategory,
  addMenuItem,
  deleteMenuItem,
  getSpecialOffer,
  updateSpecialOffer,
  searchMenuItems,
  getStats
};