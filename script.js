// frontend/script.js

// ==================== تنظیمات API ====================
// در مرحله توسعه: localhost
// بعد از استقرار بک‌اند: آدرس سرور واقعی
const API_BASE_URL = 'http://localhost:3000/api';
// بعداً در مرحله تولید به این تغییر می‌کند:
// const API_BASE_URL = 'https://your-backend-url.com/api';

// ==================== وضعیت برنامه ====================
const state = {
    menuItems: [],
    specialOffer: "در حال بارگذاری...",
    darkMode: false,
    isAdminLoggedIn: false,
    nextItemId: 100,
    currentImageBase64: null
};

// ==================== DOM Elements ====================
const themeToggle = document.getElementById('themeToggle');
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const closeAdmin = document.getElementById('closeAdmin');
const categoryNav = document.getElementById('categoryNav');
const menuSections = document.getElementById('menuSections');
const specialOfferText = document.getElementById('specialOfferText');
const loginForm = document.getElementById('loginForm');
const adminContent = document.getElementById('adminContent');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const specialOfferInput = document.getElementById('specialOfferInput');
const updateSpecialOfferBtn = document.getElementById('updateSpecialOffer');
const itemNameInput = document.getElementById('itemName');
const itemDescriptionInput = document.getElementById('itemDescription');
const itemPriceInput = document.getElementById('itemPrice');
const itemCategoryInput = document.getElementById('itemCategory');
const itemDiscountInput = document.getElementById('itemDiscount');
const itemTagsInput = document.getElementById('itemTags');
const itemImageInput = document.getElementById('itemImage');
const uploadImageBtn = document.getElementById('uploadImageBtn');
const imagePreview = document.getElementById('imagePreview');
const addItemBtn = document.getElementById('addItemBtn');
const adminItemsList = document.getElementById('adminItemsList');
const resetDataBtn = document.getElementById('resetDataBtn');
const logoutBtn = document.getElementById('logoutBtn');

// ==================== توابع API ====================

// دریافت همه آیتم‌های منو از سرور
async function fetchMenuItems() {
    try {
        console.log('دریافت منو از:', `${API_BASE_URL}/menu-items`);
        const response = await fetch(`${API_BASE_URL}/menu-items`);
        if (!response.ok) throw new Error(`خطای سرور: ${response.status}`);
        const data = await response.json();
        console.log('آیتم‌های دریافت شده:', data);
        return data;
    } catch (error) {
        console.error('خطا در دریافت منو:', error);
        showErrorToUser('خطا در بارگذاری منو. لطفاً صفحه را رفرش کنید.');
        return [];
    }
}

// ذخیره آیتم جدید در سرور
async function saveMenuItem(item) {
    try {
        const response = await fetch(`${API_BASE_URL}/menu-items`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(item)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`خطای سرور: ${response.status} - ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('خطا در ذخیره آیتم:', error);
        showErrorToUser('خطا در ذخیره آیتم. لطفاً دوباره امتحان کنید.');
        return null;
    }
}

// حذف آیتم از سرور
async function deleteMenuItem(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('خطا در حذف آیتم:', error);
        showErrorToUser('خطا در حذف آیتم.');
        return false;
    }
}

// دریافت پیشنهاد ویژه از سرور
async function fetchSpecialOffer() {
    try {
        const response = await fetch(`${API_BASE_URL}/special-offer`);
        if (!response.ok) throw new Error('خطا در دریافت پیشنهاد ویژه');
        const data = await response.json();
        return data.offer;
    } catch (error) {
        console.error('خطا در دریافت پیشنهاد ویژه:', error);
        return "پیشنهاد ویژه";
    }
}

// به‌روزرسانی پیشنهاد ویژه در سرور
async function updateSpecialOffer(newOffer) {
    try {
        const response = await fetch(`${API_BASE_URL}/special-offer`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ offer: newOffer })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`خطای سرور: ${response.status} - ${errorText}`);
        }
        
        return true;
    } catch (error) {
        console.error('خطا در به‌روزرسانی پیشنهاد ویژه:', error);
        showErrorToUser('خطا در به‌روزرسانی پیشنهاد ویژه.');
        return false;
    }
}

// ==================== توابع کمکی ====================

function showErrorToUser(message) {
    // یک راه ساده برای نمایش خطا به کاربر
    alert(`⚠️ ${message}`);
}

// تبدیل فایل عکس به Base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// عکس پیش‌فرض برای آیتم‌ها
const defaultImages = {
    'اسپرسو': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEI0NTEzIi8+PGcgZmlsbD0iI0QyNjkxRSI+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI2MCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMzAiLz48L2c+PC9zdmc+',
    'لاته': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGN0Q5Ii8+PGcgZmlsbD0iIzhCNDUxMyI+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI2MCIvPjxyZWN0IHg9IjkwIiB5PSIxNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjAiIHJ4PSIxMCIvPjwvZz48L3N2Zz4=',
    'کاپوچینو': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZht0PSIxMDAlIiBmaWxsPSIjRkZGN0Q5Ii8+PGcgZmlsbD0iIzhCNDUxMyI+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI2MCIvPjxyZWN0IHg9IjkwIiB5PSIxNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjAiIHJ4PSIxMCIvPjwvZz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI2MCIgcj0iMzAiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPjwvc3ZnPg=='
};

function getDefaultImage(itemName) {
    return defaultImages[itemName] || defaultImages['اسپرسو'];
}

// ==================== توابع اصلی ====================

// بارگذاری اولیه داده‌ها
async function loadInitialData() {
    console.log('شروع بارگذاری داده‌ها...');
    
    // نمایش حالت بارگذاری
    menuSections.innerHTML = '<div class="loading">در حال بارگذاری منو...</div>';
    specialOfferText.textContent = 'در حال بارگذاری...';
    
    // بارگذاری موازی داده‌ها
    const [menuItems, specialOffer] = await Promise.all([
        fetchMenuItems(),
        fetchSpecialOffer()
    ]);
    
    state.menuItems = menuItems;
    state.specialOffer = specialOffer;
    
    // محاسبه nextItemId
    if (state.menuItems.length > 0) {
        const maxId = Math.max(...state.menuItems.map(item => item.id));
        state.nextItemId = maxId + 1;
    }
    
    console.log('داده‌های بارگذاری شده:', {
        menuItems: state.menuItems.length,
        specialOffer: state.specialOffer,
        nextItemId: state.nextItemId
    });
    
    renderMenuItems();
    updateSpecialOfferDisplay();
}

// نمایش آیتم‌های منو
function renderMenuItems(category = 'all') {
    console.log('رندر منو برای دسته:', category);
    
    // پاک کردن محتوای قبلی
    menuSections.innerHTML = '';
    
    // اگر منو خالی است
    if (state.menuItems.length === 0) {
        menuSections.innerHTML = `
            <div class="no-items">
                <i class="fas fa-coffee" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                <h3>منوی خالی است</h3>
                <p>هنوز هیچ آیتمی به منو اضافه نشده است.</p>
                <button class="btn" onclick="document.getElementById('adminBtn').click()">
                    <i class="fas fa-plus"></i> افزودن آیتم جدید
                </button>
            </div>
        `;
        return;
    }
    
    // گروه‌بندی آیتم‌ها بر اساس دسته‌بندی
    const categories = ['all', ...new Set(state.menuItems.map(item => item.category))];
    
    categories.forEach(cat => {
        if (cat === 'all' && category !== 'all') return;
        
        const categoryItems = category === 'all' || cat === category 
            ? state.menuItems.filter(item => category === 'all' || item.category === category)
            : state.menuItems.filter(item => item.category === cat);
        
        if (categoryItems.length === 0) return;
        
        // نام فارسی دسته‌بندی‌ها
        const categoryNames = {
            'all': 'همه',
            'hot-coffee': 'قهوه گرم',
            'cold-coffee': 'قهوه سرد',
            'tea': 'چای',
            'dessert': 'دسر',
            'breakfast': 'صبحانه'
        };
        
        const section = document.createElement('div');
        section.className = `menu-section ${category === 'all' || cat === category ? 'active' : ''}`;
        section.id = `section-${cat}`;
        
        let itemsHTML = '';
        categoryItems.forEach(item => {
            const finalPrice = item.discount > 0 
                ? Math.round(item.price * (1 - item.discount / 100))
                : item.price;
            
            const discountBadge = item.discount > 0 
                ? `<span class="discount-badge">${item.discount}% تخفیف</span>`
                : '';
            
            const originalPrice = item.discount > 0 
                ? `<span class="original-price">${item.price.toLocaleString('fa-IR')} تومان</span>`
                : '';
            
            const tagsHTML = item.tags.map(tag => `<span class="item-tag">${tag}</span>`).join('');
            
            const ratingStars = '★'.repeat(Math.floor(item.rating || 4)) + '☆'.repeat(5 - Math.floor(item.rating || 4));
            
            itemsHTML += `
                <div class="menu-item scroll-animation" data-id="${item.id}">
                    <img src="${item.image || getDefaultImage(item.name)}" alt="${item.name}" class="item-image" onerror="this.src='${getDefaultImage('اسپرسو')}'">
                    <div class="item-content">
                        <div class="item-header">
                            <h3 class="item-title">${item.name}</h3>
                            <div class="item-price">
                                ${discountBadge}
                                ${finalPrice.toLocaleString('fa-IR')} تومان
                                ${originalPrice}
                            </div>
                        </div>
                        <p class="item-description">${item.description}</p>
                        <div class="item-footer">
                            <div class="item-tags">${tagsHTML}</div>
                            <div class="item-rating">${ratingStars} (${item.rating || 4})</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        section.innerHTML = `
            <h2 class="section-title">${categoryNames[cat] || cat}</h2>
            <div class="menu-items">
                ${itemsHTML}
            </div>
        `;
        
        menuSections.appendChild(section);
    });
    
    // فعال‌سازی انیمیشن اسکرول
    setTimeout(setupScrollAnimations, 100);
}

// به‌روزرسانی نمایش پیشنهاد ویژه
function updateSpecialOfferDisplay() {
    specialOfferText.textContent = state.specialOffer;
}

// بارگذاری آیتم‌ها در پنل مدیریت
async function loadAdminItems() {
    console.log('بارگذاری آیتم‌ها برای پنل مدیریت...');
    
    adminItemsList.innerHTML = '';
    
    if (state.menuItems.length === 0) {
        adminItemsList.innerHTML = '<p>هیچ آیتمی برای نمایش وجود ندارد.</p>';
        return;
    }
    
    state.menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'admin-item';
        itemElement.innerHTML = `
            <img src="${item.image || getDefaultImage(item.name)}" alt="${item.name}" class="admin-item-image">
            <div class="admin-item-info">
                <div><strong>${item.name}</strong></div>
                <div style="font-size: 0.9rem; color: #666;">${item.category} - ${item.price.toLocaleString('fa-IR')} تومان</div>
                ${item.discount > 0 ? `<div style="font-size: 0.8rem; color: #FF5722;">${item.discount}% تخفیف</div>` : ''}
            </div>
            <button class="btn btn-danger delete-item-btn" data-id="${item.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">
                حذف
            </button>
        `;
        
        adminItemsList.appendChild(itemElement);
    });
    
    // اضافه کردن event listener برای دکمه‌های حذف
    document.querySelectorAll('.delete-item-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.dataset.id);
            if (confirm(`آیا از حذف این آیتم مطمئن هستید؟`)) {
                const success = await deleteMenuItem(id);
                if (success) {
                    state.menuItems = state.menuItems.filter(item => item.id !== id);
                    renderMenuItems();
                    loadAdminItems();
                    showSuccessMessage('آیتم با موفقیت حذف شد.');
                }
            }
        });
    });
}

// انیمیشن اسکرول
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.menu-item').forEach(item => {
        observer.observe(item);
    });
}

function showSuccessMessage(message) {
    // یک راه ساده برای نمایش پیام موفقیت
    alert(`✅ ${message}`);
}

// ==================== Event Listeners ====================

// تغییر تم
themeToggle.addEventListener('click', () => {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode', state.darkMode);
    themeToggle.innerHTML = state.darkMode 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    
    // ذخیره در localStorage
    localStorage.setItem('cafeDarkMode', state.darkMode.toString());
});

// مدیریت پنل ادمین
adminBtn.addEventListener('click', () => {
    adminPanel.classList.add('active');
    if (!state.isAdminLoggedIn) {
        loginForm.style.display = 'block';
        adminContent.style.display = 'none';
        loginError.style.display = 'none';
    } else {
        loadAdminItems();
    }
});

closeAdmin.addEventListener('click', () => {
    adminPanel.classList.remove('active');
});

// فیلتر دسته‌بندی‌ها
categoryNav.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        const category = e.target.dataset.category;
        renderMenuItems(category);
    }
});

// آپلود عکس
uploadImageBtn.addEventListener('click', () => {
    itemImageInput.click();
});

itemImageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        // بررسی حجم فایل (حداکثر 1MB)
        if (file.size > 1024 * 1024) {
            alert('حجم فایل باید کمتر از 1MB باشد');
            itemImageInput.value = '';
            return;
        }
        
        // بررسی نوع فایل
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            alert('فقط فایل‌های JPG و PNG مجاز هستند');
            itemImageInput.value = '';
            return;
        }
        
        try {
            const base64 = await convertImageToBase64(file);
            state.currentImageBase64 = base64;
            imagePreview.src = base64;
            imagePreview.classList.add('active');
        } catch (error) {
            console.error('خطا در تبدیل عکس:', error);
            alert('خطا در بارگذاری عکس');
        }
    }
});

// سیستم ورود
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (username === 'matin' && password === '1025') {
        state.isAdminLoggedIn = true;
        loginForm.style.display = 'none';
        adminContent.style.display = 'block';
        loginError.style.display = 'none';
        loadAdminItems();
        showSuccessMessage('با موفقیت وارد شدید.');
    } else {
        loginError.style.display = 'block';
    }
});

// به‌روزرسانی پیشنهاد ویژه
updateSpecialOfferBtn.addEventListener('click', async () => {
    const newOffer = specialOfferInput.value.trim();
    if (newOffer) {
        const success = await updateSpecialOffer(newOffer);
        if (success) {
            state.specialOffer = newOffer;
            updateSpecialOfferDisplay();
            specialOfferInput.value = '';
            showSuccessMessage('پیشنهاد ویژه با موفقیت بروزرسانی شد.');
        }
    } else {
        alert('لطفاً متن پیشنهاد ویژه را وارد کنید.');
    }
});

// افزودن آیتم جدید
addItemBtn.addEventListener('click', async () => {
    const name = itemNameInput.value.trim();
    const description = itemDescriptionInput.value.trim();
    const price = parseInt(itemPriceInput.value);
    const category = itemCategoryInput.value;
    const discount = parseInt(itemDiscountInput.value) || 0;
    const tags = itemTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // اعتبارسنجی
    if (!name) {
        alert('لطفاً نام آیتم را وارد کنید.');
        return;
    }
    
    if (!description) {
        alert('لطفاً توضیحات آیتم را وارد کنید.');
        return;
    }
    
    if (!price || price <= 0) {
        alert('لطفاً قیمت معتبر وارد کنید.');
        return;
    }
    
    // استفاده از عکس آپلود شده یا عکس پیش‌فرض
    let image = state.currentImageBase64;
    if (!image) {
        image = getDefaultImage(name);
    }
    
    const newItem = {
        id: state.nextItemId++,
        name,
        description,
        price,
        category,
        discount,
        tags: tags.length > 0 ? tags : ['جدید'],
        rating: 4.5,
        image: image
    };
    
    console.log('آیتم جدید برای ارسال:', newItem);
    
    const savedItem = await saveMenuItem(newItem);
    if (savedItem) {
        state.menuItems.push(savedItem);
        renderMenuItems();
        loadAdminItems();
        
        // پاک کردن فرم
        itemNameInput.value = '';
        itemDescriptionInput.value = '';
        itemPriceInput.value = '';
        itemDiscountInput.value = '';
        itemTagsInput.value = '';
        itemImageInput.value = '';
        imagePreview.src = '';
        imagePreview.classList.remove('active');
        state.currentImageBase64 = null;
        
        showSuccessMessage('آیتم جدید با موفقیت اضافه شد.');
    }
});

// بازنشانی داده‌ها (بارگذاری مجدد)
resetDataBtn.addEventListener('click', () => {
    if (confirm('آیا مطمئن هستید؟ این کار منوی فعلی را با داده‌های اولیه جایگزین می‌کند.')) {
        loadInitialData();
        showSuccessMessage('داده‌های اولیه بارگذاری شدند.');
    }
});

// خروج از پنل مدیریت
logoutBtn.addEventListener('click', () => {
    state.isAdminLoggedIn = false;
    adminContent.style.display = 'none';
    loginForm.style.display = 'block';
    adminPanel.classList.remove('active');
    showSuccessMessage('با موفقیت خارج شدید.');
});

// امکان ورود با کلید Enter
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});

// ==================== راه‌اندازی اولیه ====================

// بارگذاری تنظیمات از localStorage
function loadSettings() {
    const savedDarkMode = localStorage.getItem('cafeDarkMode');
    if (savedDarkMode === 'true') {
        state.darkMode = true;
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// شروع برنامه
document.addEventListener('DOMContentLoaded', () => {
    console.log('برنامه منوی کافه در حال راه‌اندازی...');
    console.log('آدرس API:', API_BASE_URL);
    
    loadSettings();
    loadInitialData();
    
    console.log('برنامه آماده است!');
});