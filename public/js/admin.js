document.addEventListener('DOMContentLoaded', function() {
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

    fetch('/api/products')
    .then(response => response.json())
    .then(data => {
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

    fetch('/api/upload/image', {
        method: 'POST',
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

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
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
    fetch(`/api/products/${id}`)
    .then(response => {
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
    
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
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
