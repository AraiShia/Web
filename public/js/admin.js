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
});

// Global variable to store uploaded image URLs
let uploadedImages = [];
let editingProductId = null;

function showSection(sectionId) {
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
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
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
            container.innerHTML = '<div style="text-align:center; padding:60px; color:#666;">No products available. Click "Add Product" to create one.</div>';
        }
    })
    .catch(error => {
        console.error('Error loading products:', error);
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#ff6b6b;">Failed to load products</div>';
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
                <button class="edit-btn" onclick="editProduct('${productId}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${productId}')">Delete</button>
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
        alert('Only image files (JPG, PNG, WEBP, GIF) are allowed!');
        return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB!');
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
            alert('Upload failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
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
    document.getElementById('modal-title').textContent = 'Add Product';
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
        alert(isEdit ? 'Product updated successfully!' : 'Product added successfully!');
        closeModal();
        loadProducts();
        uploadedImages = [];
    })
    .catch(error => {
        console.error('Error saving product:', error);
        alert('Failed to save product');
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

        document.getElementById('modal-title').textContent = 'Edit Product';
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
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const token = localStorage.getItem('token');
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => response.json())
    .then(() => {
        alert('Product deleted successfully!');
        loadProducts();
    })
    .catch(error => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
    });
}

// Content Management
function editContent(page) {
    document.getElementById('content-page').value = page;
    document.getElementById('content-modal-title').textContent = `Edit ${page.charAt(0).toUpperCase() + page.slice(1)} Page Content`;
    
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
        alert('Content updated successfully!');
        closeContentModal();
    })
    .catch(error => {
        console.error('Error updating content:', error);
        alert('Failed to update content');
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
            container.innerHTML = '<div style="text-align:center; padding:60px; color:#666;">No products found</div>';
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
            container.innerHTML = '<div style="text-align:center; padding:60px; color:#666;">No inquiries yet</div>';
        }
    })
    .catch(error => {
        console.error('Error loading inquiries:', error);
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#ff6b6b;">Failed to load inquiries</div>';
    });
}

// Create inquiry card HTML
function createInquiryCard(inquiry) {
    const date = new Date(inquiry.createdAt);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const statusClass = inquiry.isRead ? 'read' : 'unread';
    const statusText = inquiry.isRead ? 'Read' : 'New';

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
                ${inquiry.product ? `<p class="inquiry-product"><strong>Product:</strong> ${inquiry.product}</p>` : ''}
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
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${inq.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value"><a href="mailto:${inq.email}">${inq.email}</a></span>
                    </div>
                    ${inq.phone ? `<div class="detail-row"><span class="detail-label">Phone:</span><span class="detail-value">${inq.phone}</span></div>` : ''}
                    ${inq.company ? `<div class="detail-row"><span class="detail-label">Company:</span><span class="detail-value">${inq.company}</span></div>` : ''}
                    ${inq.product ? `<div class="detail-row"><span class="detail-label">Product:</span><span class="detail-value">${inq.product}</span></div>` : ''}
                    <div class="detail-row">
                        <span class="detail-label">Submitted:</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value ${inq.isRead ? 'read' : 'unread'}">${inq.isRead ? 'Read' : 'Unread'}</span>
                    </div>
                    <div class="detail-message">
                        <span class="detail-label">Message:</span>
                        <div class="message-box">${inq.message}</div>
                    </div>
                    <div class="detail-actions">
                        <a href="mailto:${inq.email}?subject=Re: Your Inquiry" class="btn btn-primary">Reply via Email</a>
                        <button class="btn btn-danger" onclick="deleteInquiry('${inq.id}')">Delete</button>
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
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

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
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px; color:#ff6b6b;">Failed to load articles</td></tr>';
    }
}

function renderArticlesTable(articles) {
    const tbody = document.getElementById('articles-table-body');
    if (!tbody) return;
    
    if (articles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px; color:#666;">No articles found</td></tr>';
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
            '<td><span class="badge ' + (article.isPublished ? 'badge-success' : 'badge-draft') + '">' + (article.isPublished ? 'Published' : 'Draft') + '</span></td>' +
            '<td>' +
                '<button class="edit-btn" onclick="editArticle(\'' + article.id + '\')">✏️</button>' +
                '<button class="delete-btn" onclick="deleteArticle(\'' + article.id + '\')">🗑️</button>' +
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

function showArticleModal(article = null) {
    const isEdit = article !== null;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:1000;';
    
    modal.innerHTML = `
        <div style="background:#1a1a2e; border-radius:12px; padding:30px; max-width:600px; width:90%; max-height:90vh; overflow-y:auto;">
            <h2 style="color:#fff; margin-bottom:20px;">${isEdit ? 'Edit Article' : 'Add New Article'}</h2>
            <form id="article-form">
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">Title</label>
                    <input type="text" name="title" value="${article?.title || ''}" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">Category</label>
                    <select name="category" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                        <option value="news" ${article?.category === 'news' ? 'selected' : ''}>News</option>
                        <option value="guide" ${article?.category === 'guide' ? 'selected' : ''}>Guide</option>
                        <option value="blog" ${article?.category === 'blog' ? 'selected' : ''}>Blog</option>
                        <option value="case" ${article?.category === 'case' ? 'selected' : ''}>Case Study</option>
                    </select>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">Author</label>
                    <input type="text" name="author" value="${article?.author || 'Soinp Team'}" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">Excerpt</label>
                    <textarea name="excerpt" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff; min-height:80px;">${article?.excerpt || ''}</textarea>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">Content (HTML)</label>
                    <textarea name="content" required style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff; min-height:200px;">${article?.content || ''}</textarea>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">Tags (comma-separated)</label>
                    <input type="text" name="tags" value="${article?.tags?.join(', ') || ''}" style="width:100%; padding:10px; border:1px solid #333; border-radius:8px; background:#0f0f1a; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">
                        <input type="checkbox" name="isFeatured" ${article?.isFeatured ? 'checked' : ''}> Featured Article
                    </label>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#fff; display:block; margin-bottom:5px;">
                        <input type="checkbox" name="isPublished" ${article?.isPublished !== false ? 'checked' : ''}> Published
                    </label>
                </div>
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button type="button" onclick="this.closest('.modal').remove()" style="padding:10px 20px; background:#333; border:none; border-radius:8px; color:#fff; cursor:pointer;">Cancel</button>
                    <button type="submit" style="padding:10px 20px; background:#6366f1; border:none; border-radius:8px; color:#fff; cursor:pointer;">${isEdit ? 'Update' : 'Create'}</button>
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
                alert('Failed to save article');
            }
        } catch (error) {
            console.error('Error saving article:', error);
            alert('Failed to save article');
        }
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function editArticle(id) {
    const article = allArticles.find(a => a.id === id);
    if (article) {
        showArticleModal(article);
    }
}

async function deleteArticle(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/articles/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
            loadArticles();
        } else {
            alert('Failed to delete article');
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article');
    }
};
