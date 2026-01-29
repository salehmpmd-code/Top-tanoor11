// data/seedData.js

const MenuItem = require('../models/menuItem');

// تصاویر پیش‌فرض Base64 (SVG)
const defaultImages = {
  'اسپرسو': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEI0NTEzIi8+PGcgZmlsbD0iI0QyNjkxRSI+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI2MCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMzAiLz48L2c+PC9zdmc+',
  'لاته': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGN0Q5Ii8+PGcgZmlsbD0iIzhCNDUxMyI+PGNpcmNsZSBjeD0i150IiBjeT0iMTAwIiByPSI2MCIvPjxyZWN0IHg9IjkwIiB5PSIxNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjAiIHJ4PSIxMCIvPjwvZz48L3N2Zz4=',
  'کاپوچینو': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGN0Q5Ii8+PGcgZmlsbD0iIzhCNDUxMyI+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI2MCIvPjxyZWN0IHg9IjkwIiB5PSIxNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjAiIHJ4PSIxMCIvPjwvZz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI2MCIgcj0iMzAiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPjwvc3ZnPg==',
  'کلد برو': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM0UyNzIzIi8+PGcgZmlsbD0iIzhCNDUxMyI+PHJlY3QgeD0iMTAwIiB5PSI1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMjAiIHJ4PSIxNSIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjYwIiByPSIxNSIvPjwvZz48L3N2Zz4=',
  'آفوگاتو': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM0UyNzIzIi8+PGcgZmlsbD0iI0ZGRkZGRiI+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNzAiIHI9IjQwIi8+PHJlY3QgeD0iMTEwIiB5PSIxMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgcng9IjUiLz48L2c+PC9zdmc+',
  'چای ماسالا': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjQzY4MjQxIi8+PGcgZmlsbD0iI0QyNjkxRSI+PHJlY3QgeD0iMTAwIiB5PSI2MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI4MCIgcng9IjEwIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNjAiIHI9IjIwIi8+PC9nPjwvc3ZnPg==',
  'صبحانه انگلیسی': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGN0Q5Ii8+PGcgZmlsbD0iI0QyNjkxRSI+PHJlY3QgeD0iODAiIHk9IjUwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwMCIgcng9IjEwIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iODAiIHI9IjIwIiBmaWxsPSIjRkZGN0Q5Ii8+PHJlY3QgeD0iMTMwIiB5PSI3MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjOEI0NTEzIi8+PC9nPjwvc3ZnPg==',
  'موکا': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM0UyNzIzIi8+PGcgZmlsbD0iIzhCNDUxMyI+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI2MCIvPjxyZWN0IHg9IjkwIiB5PSIxNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjAiIHJ4PSIxMCIvPjwvZz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI2MCIgcj0iMjUiIGZpbGw9IiM1RjRFMzciLz48L3N2Zz4=',
  'آیس آمریکانو': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjQzZFRUZGIi8+PGcgZmlsbD0iIzhCNDUxMyI+PHJlY3QgeD0iMTAwIiB5PSI2MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI4MCIgcng9IjEwIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNjAiIHI9IjIwIi8+PC9nPjwvc3ZnPg=='
};

const seedData = [
  {
    id: 1,
    name: "اسپرسو",
    description: "اسپرسو خالص و غلیظ با طعمی منحصر به فرد",
    price: 45000,
    category: "hot-coffee",
    discount: 0,
    tags: ["پرفروش", "کلاسیک"],
    rating: 4.8,
    image: defaultImages['اسپرسو'],
    isActive: true
  },
  {
    id: 2,
    name: "لاته",
    description: "ترکیب اسپرسو با شیر گرم و فوم شیر",
    price: 65000,
    category: "hot-coffee",
    discount: 10,
    tags: ["پرفروش", "فوم دار"],
    rating: 4.7,
    image: defaultImages['لاته'],
    isActive: true
  },
  {
    id: 3,
    name: "کاپوچینو",
    description: "اسپرسو با نسبت برابر شیر و فوم شیر",
    price: 60000,
    category: "hot-coffee",
    discount: 0,
    tags: ["کلاسیک", "فوم دار"],
    rating: 4.6,
    image: defaultImages['کاپوچینو'],
    isActive: true
  },
  {
    id: 4,
    name: "کلد برو",
    description: "قهوه سرد دم‌آوری شده با طعم کارامل",
    price: 75000,
    category: "cold-coffee",
    discount: 20,
    tags: ["ویژه", "تخفیف دار"],
    rating: 4.9,
    image: defaultImages['کلد برو'],
    isActive: true
  },
  {
    id: 5,
    name: "آفوگاتو",
    description: "اسپرسو داغ با بستنی وانیلی",
    price: 80000,
    category: "dessert",
    discount: 15,
    tags: ["دسر", "مخلوط"],
    rating: 4.8,
    image: defaultImages['آفوگاتو'],
    isActive: true
  },
  {
    id: 6,
    name: "چای ماسالا",
    description: "چای هندی با ادویه‌های خاص و شیر",
    price: 40000,
    category: "tea",
    discount: 0,
    tags: ["ادویه‌ای", "هندی"],
    rating: 4.5,
    image: defaultImages['چای ماسالا'],
    isActive: true
  },
  {
    id: 7,
    name: "صبحانه انگلیسی",
    description: "تخم مرغ، بیکن، قارچ، لوبیا و نان تست",
    price: 120000,
    category: "breakfast",
    discount: 10,
    tags: ["کامل", "متنوع"],
    rating: 4.7,
    image: defaultImages['صبحانه انگلیسی'],
    isActive: true
  },
  {
    id: 8,
    name: "موکا",
    description: "ترکیب اسپرسو، شیر، شکلات و خامه",
    price: 70000,
    category: "hot-coffee",
    discount: 5,
    tags: ["شکلاتی", "خامه‌ای"],
    rating: 4.6,
    image: defaultImages['موکا'],
    isActive: true
  },
  {
    id: 9,
    name: "آیس آمریکانو",
    description: "اسپرسو با آب و یخ برای روزهای گرم",
    price: 50000,
    category: "cold-coffee",
    discount: 0,
    tags: ["سبک", "مناسب تابستان"],
    rating: 4.4,
    image: defaultImages['آیس آمریکانو'],
    isActive: true
  }
];

/**
 * تابع برای بارگذاری داده‌های اولیه
 */
const seed = async () => {
  try {
    console.log('🌱 شروع بارگذاری داده‌های اولیه...');
    
    // بررسی نوع ذخیره‌سازی
    if (MenuItem.name === 'InMemoryMenuItem') {
      // حالت درون‌حافظه‌ای
      const { menuItems } = require('../controllers/menuController').inMemoryData;
      seedData.forEach(item => {
        if (!menuItems.find(existing => existing.id === item.id)) {
          menuItems.push({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      });
      console.log(`✅ ${seedData.length} آیتم اولیه به حافظه اضافه شد`);
    } else {
      // حالت MongoDB
      const count = await MenuItem.countDocuments();
      
      if (count === 0) {
        await MenuItem.insertMany(seedData);
        console.log(`✅ ${seedData.length} آیتم اولیه به دیتابیس اضافه شد`);
      } else {
        console.log(`⚠️  دیتابیس قبلاً دارای ${count} آیتم است. از بارگذاری مجدد صرف‌نظر شد.`);
      }
    }
    
    console.log('🌱 بارگذاری داده‌های اولیه تکمیل شد');
  } catch (error) {
    console.error('❌ خطا در بارگذاری داده‌های اولیه:', error);
  }
};

module.exports = {
  seedData,
  seed
};