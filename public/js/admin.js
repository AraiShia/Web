document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // 验证 token 有效
    fetch('/api/auth/verify', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => {
        if (!response.ok) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    })
    .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    });

    // 根据 URL hash 显示对应板块
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    showSection(hash);

    // 监听 hash 变化
    window.addEventListener('hashchange', function() {
        const newHash = window.location.hash.replace('#', '') || 'dashboard';
        showSection(newHash);
    });

    // 更新语言按钮状态
    updateLanguageButtons();
    
    // 初始化页面翻译
    translatePage();
    
    // 监听语言变化
    onLanguageChange(function() {
        updateLanguageButtons();
        translatePage();
        if (currentSection === 'products') loadProducts();
        if (currentSection === 'articles') loadArticles();
        if (currentSection === 'inquiries') loadInquiries();
    });
});

let currentSection = 'dashboard';

function updateLanguageButtons() {
    const lang = getCurrentLanguage();
    document.getElementById('lang-en').className = 'lang-btn' + (lang === 'en' ? ' active' : '');
    document.getElementById('lang-zh').className = 'lang-btn' + (lang === 'zh' ? ' active' : '');
}

function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        const key = el.getAttribute('data-i18n');
        const translation = t(key);
        if (translation && translation !== key) {
            el.textContent = translation;
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = t(key);
        if (translation && translation !== key) {
            el.placeholder = translation;
        }
    });
}

// Global variable to store uploaded image URLs
let uploadedImages = [];
let editingProductId = null;

function showSection(sectionId) {
    currentSection = sectionId;
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.admin-nav li').forEach(li => {
        li.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    const navItem = document.querySelector(`.admin-nav li a[href="#${sectionId}"]`);
    if (navItem) {
        navItem.parentElement.classList.add('active');
    }
    
    if (sectionId === 'products') {
        loadProducts();
    }
    if (sectionId === 'articles') {
        loadArticles();
    }
    if (sectionId === 'gallery-admin') {
        loadGallery();
    }
    if (sectionId === 'categories-admin') {
        loadCategories();
    }
    if (sectionId === 'banner-admin') {
        loadBannerAdmin();
    }
    if (sectionId === 'settings') {
        loadSettingsBanner();
        loadThemeSetting();
    }
}

function logout() {
    if (confirm(t('areYouSure') + ' ' + t('logoutConfirm'))) {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    }
}

// Product Management
function loadProducts() {
    const container = document.getElementById('products-list');
    if (!container) return;

    const token = localStorage.getItem('token');
    fetch('/api/products', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => {
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;
        const products = data.products;
        if (products && products.length > 0) {
            container.innerHTML = products.map(product => createProductCard(product)).join('');
        } else {
            container.innerHTML = '<div style="text-align:center; padding:60px; color:#666;">' + t('noProductsAvailable') + '</div>';
        }
    })
    .catch(error => {
        console.error('Error loading products:', error);
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#ff6b6b;">' + t('failedToLoadProducts') + '</div>';
    });
}

function createProductCard(product) {
    const productId = product.id || product._id;
    return `
        <div class="product-card-admin">
            <h4>${product.name}</h4>
            <div class="category">${product.category}</div>
            <div class="price">$${product.price}${product.originalPrice ? ` <span style="font-size:14px; color:#666; text-decoration:line-through;">$${product.originalPrice}</span>` : ''}</div>
            <div class="actions">
                <button class="edit-btn" onclick="editProduct('${productId}')">${t('edit')}</button>
                <button class="delete-btn" onclick="deleteProduct('${productId}')">${t('delete')}</button>
            </div>
        </div>
    `;
}

// Image upload handling
function handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        alert(t('onlyImageFiles'));
        return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert(t('fileSizeLimit'));
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    // Show loading state
    const uploadArea = document.getElementById('image-upload-area');
    uploadArea.innerHTML += '<div class="upload-progress"><div class="upload-progress-bar" style="width: 0%"></div></div>';

    const token = localStorage.getItem('token');
    fetch('/api/upload/image', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            uploadedImages.push(data.url);
            renderUploadedImages();
        } else {
            alert(t('uploadFailed') + ' ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        alert(t('failedToUpload'));
    })
    .finally(() => {
        // Reset file input
        input.value = '';
        const progress = uploadArea.querySelector('.upload-progress');
        if (progress) progress.remove();
    });
}

function renderUploadedImages() {
    const container = document.getElementById('uploaded-images');

    container.innerHTML = uploadedImages.map((url, index) => `
        <div class="uploaded-image${index === 0 ? ' is-main' : ''}" draggable="true" data-index="${index}">
            ${index === 0 ? '<span class="main-badge">MAIN</span>' : ''}
            <img src="${url}" alt="Product image ${index + 1}">
            <div class="image-actions">
                <button class="move-btn move-left" onclick="moveImage(${index}, -1)" title="Move left" ${index === 0 ? 'disabled' : ''}>&#9664;</button>
                <button class="remove-btn" onclick="removeImage(${index})" title="Remove">&times;</button>
                <button class="move-btn move-right" onclick="moveImage(${index}, 1)" title="Move right" ${index === uploadedImages.length - 1 ? 'disabled' : ''}>&#9654;</button>
            </div>
        </div>
    `).join('');

    // 拖拽排序事件
    container.querySelectorAll('.uploaded-image').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

// 拖拽排序
let dragIndex = null;

function handleDragStart(e) {
    dragIndex = parseInt(this.dataset.index);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const dropIndex = parseInt(this.dataset.index);

    if (dragIndex !== null && dragIndex !== dropIndex) {
        const movedImage = uploadedImages.splice(dragIndex, 1)[0];
        uploadedImages.splice(dropIndex, 0, movedImage);
        renderUploadedImages();
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.uploaded-image').forEach(item => {
        item.classList.remove('drag-over');
    });
    dragIndex = null;
}

// 箭头移动图片
function moveImage(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= uploadedImages.length) return;

    const temp = uploadedImages[index];
    uploadedImages[index] = uploadedImages[newIndex];
    uploadedImages[newIndex] = temp;
    renderUploadedImages();
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderUploadedImages();
}

function openProductModal() {
    editingProductId = null;
    document.getElementById('modal-title').textContent = t('addProduct');
    document.getElementById('product-form').reset();
    uploadedImages = [];
    renderUploadedImages();
    restoreUploadPlaceholder();
    document.getElementById('product-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
    editingProductId = null;
}

function restoreUploadPlaceholder() {
    const uploadArea = document.getElementById('image-upload-area');
    uploadArea.innerHTML = `
        <input type="file" id="product-image" accept="image/*" style="display:none;" onchange="handleImageUpload(this)">
        <div class="upload-placeholder" onclick="document.getElementById('product-image').click()">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>Click to upload image</p>
            <span>PNG, JPG, WEBP up to 5MB</span>
        </div>
        <div class="uploaded-images" id="uploaded-images"></div>
    `;
}

// 统一的表单提交处理
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        originalPrice: document.getElementById('product-original-price').value ? parseFloat(document.getElementById('product-original-price').value) : null,
        badge: document.getElementById('product-badge').value || '',
        description: document.getElementById('product-description').value,
        features: document.getElementById('product-features').value ? document.getElementById('product-features').value.split(',').map(f => f.trim()) : [],
        stock: parseInt(document.getElementById('product-stock').value) || 0,
        images: uploadedImages,
    };

    const isEdit = editingProductId !== null;
    const url = isEdit ? `/api/products/${editingProductId}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const token = localStorage.getItem('token');
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(productData),
    })
    .then(response => response.json())
    .then(() => {
        alert(isEdit ? t('productUpdated') : t('productAdded'));
        closeModal();
        loadProducts();
        uploadedImages = [];
    })
    .catch(error => {
        console.error('Error saving product:', error);
        alert(t('failedToSaveProduct'));
    });
});

function editProduct(id) {
    const token = localStorage.getItem('token');
    fetch(`/api/products/${id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => {
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(product => {
        if (!product || product.message) {
            throw new Error(product.message || 'Product not found');
        }

        // 设置编辑状态
        editingProductId = id;

        document.getElementById('modal-title').textContent = t('editProduct');
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-category').value = product.category || '';
        document.getElementById('product-price').value = product.price || '';
        document.getElementById('product-original-price').value = product.originalPrice || '';
        document.getElementById('product-badge').value = product.badge || '';
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-features').value = product.features ? product.features.join(', ') : '';
        document.getElementById('product-stock').value = product.stock || 0;

        // 加载已有图片
        uploadedImages = product.images ? [...product.images] : [];
        restoreUploadPlaceholder();
        renderUploadedImages();

        document.getElementById('product-modal').classList.add('active');
    })
    .catch(error => {
        console.error('Error loading product:', error);
        alert('Failed to load product');
    });
}

function deleteProduct(id) {
    if (!confirm(t('areYouSure') + ' ' + t('deleteThisProduct'))) return;
    
    const token = localStorage.getItem('token');
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => response.json())
    .then(() => {
        alert(t('productDeleted'));
        loadProducts();
    })
    .catch(error => {
        console.error('Error deleting product:', error);
        alert(t('failedToSaveProduct'));
    });
}

// Content Management
function editContent(page) {
    document.getElementById('content-page').value = page;
    const pageNames = { 'home': t('homePage'), 'about': t('aboutPage'), 'contact': t('contactPage'), 'products': t('productsPage') };
    document.getElementById('content-modal-title').textContent = t('edit') + ' ' + (pageNames[page] || page) + ' ' + t('pageContent');
    
    fetch(`/api/content/${page}`)
    .then(response => response.json())
    .then(data => {
        const content = data.content || {};
        document.getElementById('hero-title').value = content.heroTitle || '';
        document.getElementById('hero-subtitle').value = content.heroSubtitle || '';
        document.getElementById('features-title').value = content.featuresTitle || '';
        document.getElementById('about-title').value = content.aboutTitle || '';
        document.getElementById('about-description').value = content.aboutDescription || '';
        
        document.getElementById('content-modal').classList.add('active');
    })
    .catch(error => {
        console.error('Error loading content:', error);
    });
}

function closeContentModal() {
    document.getElementById('content-modal').classList.remove('active');
}

document.getElementById('content-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const page = document.getElementById('content-page').value;
    const contentData = {
        heroTitle: document.getElementById('hero-title').value,
        heroSubtitle: document.getElementById('hero-subtitle').value,
        featuresTitle: document.getElementById('features-title').value,
        aboutTitle: document.getElementById('about-title').value,
        aboutDescription: document.getElementById('about-description').value,
    };
    
    fetch(`/api/content/${page}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentData }),
    })
    .then(response => response.json())
    .then(() => {
        alert(t('contentUpdated'));
        closeContentModal();
    })
    .catch(error => {
        console.error('Error updating content:', error);
        alert(t('failedToSaveProduct'));
    });
});

// Filter Products
document.getElementById('category-filter').addEventListener('change', function() {
    filterProducts();
});

document.getElementById('search-product').addEventListener('keyup', function() {
    filterProducts();
});

function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const search = document.getElementById('search-product').value.toLowerCase();
    
    let url = '/api/products';
    const params = [];
    
    if (category !== 'all') {
        params.push(`category=${category}`);
    }
    
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        let products = data.products;
        
        if (search) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(search) ||
                p.category.toLowerCase().includes(search)
            );
        }
        
        const container = document.getElementById('products-list');
        if (products.length > 0) {
            container.innerHTML = products.map(createProductCard).join('');
        } else {
            container.innerHTML = '<div style="text-align:center; padding:60px; color:#666;">' + t('noProductsFound') + '</div>';
        }
    })
    .catch(error => {
        console.error('Error filtering products:', error);
    });
}

// ==================== Inquiry Management ====================

// Load inquiries on page load
document.addEventListener('DOMContentLoaded', function() {
    loadInquiriesCount();
});

// Load inquiries count for badge
function loadInquiriesCount() {
    const token = localStorage.getItem('token');
    fetch('/api/inquiries/count/unread', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => response.json())
    .then(data => {
        const badge = document.getElementById('inquiry-badge');
        if (badge) {
            if (data.unreadCount > 0) {
                badge.textContent = data.unreadCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    })
    .catch(err => console.error('Error loading inquiry count:', err));
}

// Load inquiries list
function loadInquiries() {
    const container = document.getElementById('inquiries-list');
    if (!container) return;

    const token = localStorage.getItem('token');
    fetch('/api/inquiries', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => response.json())
    .then(data => {
        if (data.inquiries && data.inquiries.length > 0) {
            // Update stats
            document.getElementById('total-inquiries').textContent = data.total;
            document.getElementById('unread-inquiries').textContent = data.inquiries.filter(i => !i.isRead).length;

            container.innerHTML = data.inquiries.map(inquiry => createInquiryCard(inquiry)).join('');
        } else {
            container.innerHTML = '<div style="text-align:center; padding:60px; color:#666;">' + t('noInquiriesYet') + '</div>';
        }
    })
    .catch(error => {
        console.error('Error loading inquiries:', error);
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#ff6b6b;">' + t('failedToLoadInquiries') + '</div>';
    });
}

// Create inquiry card HTML
function createInquiryCard(inquiry) {
    const date = new Date(inquiry.createdAt);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const statusClass = inquiry.isRead ? 'read' : 'unread';
    const statusText = inquiry.isRead ? t('read') : t('new');

    return `
        <div class="inquiry-card ${statusClass}" onclick="viewInquiry('${inquiry.id}')">
            <div class="inquiry-header">
                <div class="inquiry-status ${statusClass}">${statusText}</div>
                <div class="inquiry-date">${formattedDate}</div>
            </div>
            <div class="inquiry-info">
                <h4>${inquiry.name}</h4>
                <p class="inquiry-email">${inquiry.email}</p>
                ${inquiry.company ? `<p class="inquiry-company">${inquiry.company}</p>` : ''}
                ${inquiry.product ? `<p class="inquiry-product"><strong>${t('product')}:</strong> ${inquiry.product}</p>` : ''}
            </div>
            <div class="inquiry-preview">${inquiry.message.substring(0, 100)}${inquiry.message.length > 100 ? '...' : ''}</div>
        </div>
    `;
}

// View inquiry details
function viewInquiry(id) {
    const token = localStorage.getItem('token');
    fetch(`/api/inquiries/${id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => response.json())
    .then(data => {
        if (data.inquiry) {
            const inq = data.inquiry;
            const date = new Date(inq.createdAt);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

            document.getElementById('inquiry-detail').innerHTML = `
                <div class="inquiry-detail-content">
                    <div class="detail-row">
                        <span class="detail-label">${t('name')}:</span>
                        <span class="detail-value">${inq.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${t('email')}:</span>
                        <span class="detail-value"><a href="mailto:${inq.email}">${inq.email}</a></span>
                    </div>
                    ${inq.phone ? `<div class="detail-row"><span class="detail-label">${t('phone')}:</span><span class="detail-value">${inq.phone}</span></div>` : ''}
                    ${inq.company ? `<div class="detail-row"><span class="detail-label">${t('company')}:</span><span class="detail-value">${inq.company}</span></div>` : ''}
                    ${inq.product ? `<div class="detail-row"><span class="detail-label">${t('product')}:</span><span class="detail-value">${inq.product}</span></div>` : ''}
                    <div class="detail-row">
                        <span class="detail-label">${t('submitted')}:</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${t('status')}:</span>
                        <span class="detail-value ${inq.isRead ? 'read' : 'unread'}">${inq.isRead ? t('read') : t('unread')}</span>
                    </div>
                    <div class="detail-message">
                        <span class="detail-label">${t('message')}:</span>
                        <div class="message-box">${inq.message}</div>
                    </div>
                    <div class="detail-actions">
                        <a href="mailto:${inq.email}?subject=Re: Your Inquiry" class="btn btn-primary">${t('replyViaEmail')}</a>
                        <button class="btn btn-danger" onclick="deleteInquiry('${inq.id}')">${t('delete')}</button>
                    </div>
                </div>
            `;
            document.getElementById('inquiry-modal').style.display = 'flex';

            // Mark as read
            if (!inq.isRead) {
                fetch(`/api/inquiries/${id}/read`, {
                    method: 'PUT',
                    headers: { 'Authorization': 'Bearer ' + token }
                })
                .then(() => loadInquiries());
            }
        }
    })
    .catch(err => console.error('Error loading inquiry:', err));
}

// Close inquiry modal
function closeInquiryModal() {
    document.getElementById('inquiry-modal').style.display = 'none';
    loadInquiriesCount();
}

// Delete inquiry
function deleteInquiry(id) {
    if (!confirm(t('areYouSure') + ' ' + t('deleteThisInquiry'))) return;

    const token = localStorage.getItem('token');
    fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeInquiryModal();
            loadInquiries();
            loadInquiriesCount();
        }
    })
    .catch(err => console.error('Error deleting inquiry:', err));
}

// Mark all inquiries as read
function markAllInquiriesRead() {
    const token = localStorage.getItem('token');
    fetch('/api/inquiries/read-all', {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadInquiries();
            loadInquiriesCount();
        }
    })
    .catch(err => console.error('Error marking all read:', err));
}

// Export inquiries to CSV
function exportInquiries() {
    window.location.href = '/api/inquiries/export/csv';
}

// Update showSection to load inquiries when section is shown
const originalShowSection = showSection;
showSection = function(sectionId) {
    originalShowSection(sectionId);
    if (sectionId === 'inquiries') {
        loadInquiries();
    }
}

// Articles Management
let allArticles = [];

async function loadArticles() {
    const tbody = document.getElementById('articles-table-body');
    if (!tbody) return;

    try {
        const response = await fetch('/api/articles?limit=100');
        const data = await response.json();
        allArticles = data.articles;
        renderArticlesTable(allArticles);
    } catch (error) {
        console.error('Error loading articles:', error);
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px; color:#ff6b6b;">' + t('failedToLoadArticles') + '</td></tr>';
    }
}

function renderArticlesTable(articles) {
    const tbody = document.getElementById('articles-table-body');
    if (!tbody) return;
    
    if (articles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px; color:#666;">' + t('noArticlesFound') + '</td></tr>';
        return;
    }
    
    tbody.innerHTML = articles.map(article => {
        const categoryColors = {
            'news': '#6366f1',
            'guide': '#10b981',
            'blog': '#f59e0b',
            'case': '#ec4899'
        };
        const color = categoryColors[article.category] || '#6366f1';
        
        return '<tr>' +
            '<td>' + article.id + '</td>' +
            '<td>' + article.title + '</td>' +
            '<td><span class="badge" style="background:' + color + '">' + article.category + '</span></td>' +
            '<td>' + article.author + '</td>' +
            '<td>' + article.views + '</td>' +
            '<td>' + (article.isFeatured ? '✓' : '—') + '</td>' +
            '<td><span class="badge ' + (article.isPublished ? 'badge-success' : 'badge-draft') + '">' + (article.isPublished ? t('published') : t('draft')) + '</span></td>' +
            '<td>' +
                '<button class="edit-btn" onclick="editArticle(\'' + article.id + '\')">' + t('edit') + '</button>' +
                '<button class="delete-btn" onclick="deleteArticle(\'' + article.id + '\')">' + t('delete') + '</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

function filterArticles() {
    const category = document.getElementById('article-category-filter').value;
    const search = document.getElementById('article-search').value.toLowerCase();
    
    let filtered = allArticles;
    if (category !== 'all') {
        filtered = filtered.filter(a => a.category === category);
    }
    if (search) {
        filtered = filtered.filter(a => 
            a.title.toLowerCase().includes(search) ||
            a.author.toLowerCase().includes(search)
        );
    }
    renderArticlesTable(filtered);
}

let articleImages = [];

function handleArticleImageUpload(input, modal) {
    const file = input.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        alert(t('onlyImageFiles'));
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert(t('fileSizeLimit'));
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const uploadArea = modal.querySelector('#article-image-upload-area');
    uploadArea.innerHTML += '<div class="upload-progress"><div class="upload-progress-bar" style="width: 0%"></div></div>';

    const token = localStorage.getItem('token');
    fetch('/api/upload/image', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            articleImages.push(data.url);
            renderArticleImages(modal);
        } else {
            alert(t('uploadFailed') + ' ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        alert(t('failedToUpload'));
    })
    .finally(() => {
        input.value = '';
        const progress = uploadArea.querySelector('.upload-progress');
        if (progress) progress.remove();
    });
}

function renderArticleImages(modal) {
    const container = modal.querySelector('#article-uploaded-images');
    
    container.innerHTML = articleImages.map((url, index) => `
        <div class="uploaded-image${index === 0 ? ' is-main' : ''}" style="position:relative; display:inline-block; margin:5px; width:100px; height:100px;">
            ${index === 0 ? '<span style="position:absolute; top:5px; left:5px; background:#6366f1; color:#fff; font-size:10px; padding:2px 5px; border-radius:3px;">MAIN</span>' : ''}
            <img src="${url}" alt="Article image ${index + 1}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
            <div style="position:absolute; bottom:5px; right:5px;">
                <button onclick="removeArticleImage(${index}, modal)" style="background:rgba(255,0,0,0.8); border:none; color:#fff; width:20px; height:20px; border-radius:50%; font-size:12px; cursor:pointer;">&times;</button>
            </div>
        </div>
    `).join('');
}

function removeArticleImage(index, modal) {
    articleImages.splice(index, 1);
    renderArticleImages(modal);
}

function showArticleModal(article = null) {
    const isEdit = article !== null;
    articleImages = article?.images ? [...article.images] : [];
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:1000;';
    
    const existingImagesHtml = articleImages.map((url, index) => `
        <div class="uploaded-image${index === 0 ? ' is-main' : ''}" style="position:relative; display:inline-block; margin:5px; width:100px; height:100px;">
            ${index === 0 ? '<span style="position:absolute; top:5px; left:5px; background:#6366f1; color:#fff; font-size:10px; padding:2px 5px; border-radius:3px;">MAIN</span>' : ''}
            <img src="${url}" alt="Article image ${index + 1}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
            <div style="position:absolute; bottom:5px; right:5px;">
                <button onclick="removeArticleImage(${index}, this.closest('.modal'))" style="background:rgba(255,0,0,0.8); border:none; color:#fff; width:20px; height:20px; border-radius:50%; font-size:12px; cursor:pointer;">&times;</button>
            </div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div style="background:#1a1a2e; border-radius:12px; padding:30px; max-width:600px; width:90%; max-height:90vh; overflow-y:auto;">
            <h2 style="color:#fff; margin-bottom:20px;">${isEdit ? t('edit') + ' ' + t('article') : t('addNewArticle')}</h2>
            <form id="article-form">
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('title')}</label>
                    <input type="text" name="title" value="${article?.title || ''}" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('category')}</label>
                    <select name="category" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                        <option value="news" ${article?.category === 'news' ? 'selected' : ''}>${t('news')}</option>
                        <option value="guide" ${article?.category === 'guide' ? 'selected' : ''}>${t('guides')}</option>
                        <option value="blog" ${article?.category === 'blog' ? 'selected' : ''}>${t('blog')}</option>
                        <option value="case" ${article?.category === 'case' ? 'selected' : ''}>${t('caseStudies')}</option>
                    </select>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('author')}</label>
                    <input type="text" name="author" value="${article?.author || 'Soinp Team'}" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('articleImage')}</label>
                    <div id="article-image-upload-area" style="border:2px dashed #333; border-radius:8px; padding:20px; text-align:center; background:#0f0f1a;">
                        <input type="file" id="article-image-input" accept="image/*" style="display:none;" onchange="handleArticleImageUpload(this, this.closest('.modal'))">
                        <div onclick="this.previousElementSibling.click()" style="color:#666; cursor:pointer;">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:block; margin:0 auto 10px;">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                            </svg>
                            <p>${t('clickToUpload')}</p>
                        </div>
                        <div id="article-uploaded-images" style="margin-top:15px;">${existingImagesHtml}</div>
                    </div>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('excerpt')}</label>
                    <textarea name="excerpt" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff; min-height:80px;">${article?.excerpt || ''}</textarea>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('content')}</label>
                    <textarea name="content" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff; min-height:200px;">${article?.content || ''}</textarea>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('tags')}</label>
                    <input type="text" name="tags" value="${article?.tags?.join(', ') || ''}" style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">
                        <input type="checkbox" name="isFeatured" ${article?.isFeatured ? 'checked' : ''}> ${t('featuredArticle')}
                    </label>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">
                        <input type="checkbox" name="isPublished" ${article?.isPublished !== false ? 'checked' : ''}> ${t('published')}
                    </label>
                </div>
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button type="button" onclick="this.closest('.modal').remove()" style="padding:10px 20px; background:#333; border:none; border-radius:8px; color:#fff; cursor:pointer;">${t('cancel')}</button>
                    <button type="submit" style="padding:10px 20px; background:#6366f1; border:none; border-radius:8px; color:#fff; cursor:pointer;">${isEdit ? t('update') : t('create')}</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('article-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const articleData = {
            title: formData.get('title'),
            category: formData.get('category'),
            author: formData.get('author'),
            images: articleImages,
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t),
            isFeatured: formData.get('isFeatured') === 'on',
            isPublished: formData.get('isPublished') === 'on'
        };
        
        const token = localStorage.getItem('token');
        const url = isEdit ? '/api/articles/' + article.id : '/api/articles';
        const method = isEdit ? 'PUT' : 'POST';
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(articleData)
            });
            
            if (response.ok) {
                modal.remove();
                loadArticles();
            } else {
                alert(t('failedToSaveArticle'));
            }
        } catch (error) {
            console.error('Error saving article:', error);
            alert(t('failedToSaveArticle'));
        }
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Banner Management
async function loadBannerAdmin() {
    try {
        const response = await fetch('/api/banner');
        const data = await response.json();
        const banner = data.banner || {};

        document.getElementById('banner-enabled').checked = banner.enabled !== false;
        document.getElementById('banner-badge-input').value = banner.badge || '';
        document.getElementById('banner-text-input').value = banner.text || '';
        document.getElementById('banner-code-input').value = banner.code || '';
    } catch (error) {
        console.error('Error loading banner:', error);
    }
}

async function saveBanner() {
    const bannerData = {
        enabled: document.getElementById('banner-enabled').checked,
        badge: document.getElementById('banner-badge-input').value,
        text: document.getElementById('banner-text-input').value,
        code: document.getElementById('banner-code-input').value
    };

    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/banner', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(bannerData)
        });

        if (response.ok) {
            alert(t('savedSuccessfully') || 'Banner saved successfully');
        } else {
            alert('Failed to save banner');
        }
    } catch (error) {
        console.error('Error saving banner:', error);
        alert('Failed to save banner');
    }
}

// Settings page banner controls - share the same banner.json source
async function loadSettingsBanner() {
    try {
        const response = await fetch('/api/banner');
        const data = await response.json();
        const banner = data.banner || {};

        document.getElementById('banner-toggle').checked = banner.enabled !== false;
        document.getElementById('banner-text-settings').value = banner.text || '';
        document.getElementById('banner-code-settings').value = banner.code || '';
    } catch (error) {
        console.error('Error loading settings banner:', error);
    }
}

async function saveSettingsBanner() {
    const bannerData = {
        enabled: document.getElementById('banner-toggle').checked,
        badge: 'SPECIAL OFFER',
        text: document.getElementById('banner-text-settings').value,
        code: document.getElementById('banner-code-settings').value
    };

    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/banner', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(bannerData)
        });

        if (response.ok) {
            alert(t('savedSuccessfully') || 'Banner saved successfully');
        } else {
            alert('Failed to save banner');
        }
    } catch (error) {
        console.error('Error saving settings banner:', error);
        alert('Failed to save banner');
    }
}

async function loadThemeSetting() {
    try {
        const response = await fetch('/api/theme');
        const data = await response.json();
        const select = document.getElementById('theme-select');
        if (select) {
            select.value = data.theme || 'dark';
        }
    } catch (error) {
        console.error('Error loading theme setting:', error);
    }
}

async function saveTheme() {
    const select = document.getElementById('theme-select');
    if (!select) return;

    const theme = select.value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/theme', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ theme })
        });

        if (response.ok) {
            alert(t('savedSuccessfully') || 'Theme saved successfully');
        } else {
            alert('Failed to save theme');
        }
    } catch (error) {
        console.error('Error saving theme:', error);
        alert('Failed to save theme');
    }
}

function editArticle(id) {
    const article = allArticles.find(a => a.id === id);
    if (article) {
        showArticleModal(article);
    }
}

async function deleteArticle(id) {
    if (!confirm(t('areYouSure') + ' ' + t('deleteThisArticle'))) return;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/articles/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
            loadArticles();
        } else {
            alert(t('articleDeleted'));
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        alert(t('articleDeleted'));
    }
};

// Gallery Management
let galleryImages = [];

async function loadGallery() {
    const container = document.getElementById('gallery-admin-grid');
    if (!container) return;

    try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        galleryImages = data.gallery || [];

        container.innerHTML = galleryImages.map((item, index) => `
            <div class="gallery-admin-item">
                ${item.image
                    ? `<img src="${item.image}" alt="${item.alt}">`
                    : '<div class="gallery-admin-placeholder">🖼️</div>'}
                <button class="gallery-admin-delete-btn" onclick="deleteGalleryImage(${index})" style="${item.image ? '' : 'display:none;'}">&times;</button>
                <div class="gallery-admin-overlay">
                    <button class="gallery-admin-upload-btn" onclick="uploadGalleryImage(${index})">${t('uploadImage') || 'Upload'}</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function uploadGalleryImage(index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                await updateGalleryImage(index, data.url);
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Upload failed');
        }
    };
    input.click();
}

async function updateGalleryImage(index, imageUrl) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/gallery/${galleryImages[index].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ image: imageUrl, alt: 'Gallery Image ' + (index + 1) })
        });

        if (response.ok) {
            loadGallery();
        } else {
            alert('Failed to update gallery');
        }
    } catch (error) {
        console.error('Error updating gallery:', error);
        alert('Failed to update gallery');
    }
}

async function deleteGalleryImage(index) {
    if (!confirm(t('areYouSure') + ' ' + (t('deleteThisImage') || 'Delete this image?'))) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/gallery/${galleryImages[index].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ image: '', alt: 'Gallery Image ' + (index + 1) })
        });

        if (response.ok) {
            loadGallery();
        } else {
            alert('Failed to delete image');
        }
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        alert('Failed to delete image');
    }
}

// Categories Management
let allCategories = [];

async function loadCategories() {
    const container = document.getElementById('categories-admin-grid');
    if (!container) return;

    try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        allCategories = data.categories || [];

        container.innerHTML = allCategories.map(cat => `
            <div class="category-admin-item">
                ${cat.image
                    ? `<img src="${cat.image}" alt="${cat.name}" class="category-admin-image">`
                    : `<div class="category-admin-placeholder" onclick="uploadCategoryImage('${cat.id}')">🖼️</div>`}
                <div class="category-admin-content">
                    <h3 class="category-admin-name">${cat.name}</h3>
                    <p class="category-admin-desc">${cat.description}</p>
                    <div class="category-admin-actions">
                        <button class="category-admin-upload-btn" onclick="uploadCategoryImage('${cat.id}')">${t('uploadImage')}</button>
                        <button class="category-admin-edit-btn" onclick="editCategory('${cat.id}')">${t('edit')}</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function uploadCategoryImage(categoryId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                await updateCategory(categoryId, { image: data.url });
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Upload failed');
        }
    };
    input.click();
}

async function updateCategory(categoryId, updates) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            loadCategories();
        } else {
            alert('Failed to update category');
        }
    } catch (error) {
        console.error('Error updating category:', error);
        alert('Failed to update category');
    }
}

function editCategory(categoryId) {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:1000;';

    modal.innerHTML = `
        <div style="background:#1a1a2e; border-radius:12px; padding:30px; max-width:500px; width:90%;">
            <h2 style="color:#fff; margin-bottom:20px;">${t('edit') + ' ' + t('category')}</h2>
            <form id="category-form">
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('name')}</label>
                    <input type="text" name="name" value="${category.name}" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('description')}</label>
                    <textarea name="description" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff; min-height:80px;">${category.description}</textarea>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">${t('badge') || 'Badge'}</label>
                    <input type="text" name="badge" value="${category.badge}" style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">
                        <input type="checkbox" name="isComingSoon" ${category.isComingSoon ? 'checked' : ''}> ${t('comingSoon') || 'Coming Soon'}
                    </label>
                </div>
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button type="button" onclick="this.closest('.modal').remove()" style="padding:10px 20px; background:#333; border:none; border-radius:8px; color:#fff; cursor:pointer;">${t('cancel')}</button>
                    <button type="submit" style="padding:10px 20px; background:#6366f1; border:none; border-radius:8px; color:#fff; cursor:pointer;">${t('save') || 'Save'}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('category-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const updates = {
            name: formData.get('name'),
            description: formData.get('description'),
            badge: formData.get('badge'),
            isComingSoon: formData.get('isComingSoon') === 'on'
        };

        await updateCategory(categoryId, updates);
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
