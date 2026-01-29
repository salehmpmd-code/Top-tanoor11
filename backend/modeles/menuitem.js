// models/menuItem.js

const mongoose = require('mongoose');

// اگر مونگوس وصل نیست، مدل ساده در حافظه بساز
if (mongoose.connection.readyState === 0) {
  // مدل ساده برای حالت درون‌حافظه‌ای
  class InMemoryMenuItem {
    constructor(data) {
      this.id = data.id || Date.now();
      this.name = data.name;
      this.description = data.description;
      this.price = data.price;
      this.category = data.category;
      this.discount = data.discount || 0;
      this.tags = data.tags || [];
      this.rating = data.rating || 4.5;
      this.image = data.image || null;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }

  module.exports = InMemoryMenuItem;
} else {
  // مدل MongoDB
  const menuItemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'نام آیتم الزامی است'],
      trim: true,
      minlength: [2, 'نام آیتم باید حداقل ۲ حرف باشد'],
      maxlength: [100, 'نام آیتم نمی‌تواند بیش از ۱۰۰ حرف باشد']
    },
    description: {
      type: String,
      required: [true, 'توضیحات الزامی است'],
      trim: true,
      minlength: [10, 'توضیحات باید حداقل ۱۰ حرف باشد'],
      maxlength: [500, 'توضیحات نمی‌تواند بیش از ۵۰۰ حرف باشد']
    },
    price: {
      type: Number,
      required: [true, 'قیمت الزامی است'],
      min: [1000, 'حداقل قیمت ۱۰۰۰ تومان است'],
      max: [1000000, 'حداکثر قیمت ۱,۰۰۰,۰۰۰ تومان است']
    },
    category: {
      type: String,
      required: [true, 'دسته‌بندی الزامی است'],
      enum: {
        values: ['hot-coffee', 'cold-coffee', 'tea', 'dessert', 'breakfast'],
        message: 'دسته‌بندی معتبر نیست'
      }
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'تخفیف نمی‌تواند منفی باشد'],
      max: [100, 'تخفیف نمی‌تواند بیش از ۱۰۰٪ باشد']
    },
    tags: [{
      type: String,
      trim: true
    }],
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'امتیاز نمی‌تواند کمتر از ۱ باشد'],
      max: [5, 'امتیاز نمی‌تواند بیش از ۵ باشد']
    },
    image: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }, {
    timestamps: true // ایجاد createdAt و updatedAt به صورت خودکار
  });

  // ایندکس‌گذاری برای جستجوی بهتر
  menuItemSchema.index({ name: 'text', description: 'text' });
  menuItemSchema.index({ category: 1 });
  menuItemSchema.index({ price: 1 });
  menuItemSchema.index({ discount: -1 });

  module.exports = mongoose.model('MenuItem', menuItemSchema);
}