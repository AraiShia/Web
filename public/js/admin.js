document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

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
        if (products.length > 0) {
            container.innerHTML = products.map(product => createProductCard(product)).join('');
        } else {
            container.innerHTML = '<div style="text-align:center; padding:60px; color:#666;">No products available</div>';
        }
    })
    .catch(error => {
        console.error('Error loading products:', error);
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#666;">Failed to load products</div>';
    });
}

function createProductCard(product) {
    return `
        <div class="product-card-admin">
            <h4>${product.name}</h4>
            <div class="category">${product.category}</div>
            <div class="price">$${product.price}${product.originalPrice ? ` <span style="font-size:14px; color:#666; text-decoration:line-through;">$${product.originalPrice}</span>` : ''}</div>
            <div class="actions">
                <button class="edit-btn" onclick="editProduct('${product._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
            </div>
        </div>
    `;
}

function openProductModal() {
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

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
    };
    
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    .then(response => response.json())
    .then(() => {
        alert('Product added successfully!');
        closeModal();
        loadProducts();
    })
    .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product');
    });
});

function editProduct(id) {
    fetch(`/api/products/${id}`)
    .then(response => response.json())
    .then(product => {
        document.getElementById('modal-title').textContent = 'Edit Product';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-original-price').value = product.originalPrice || '';
        document.getElementById('product-badge').value = product.badge || '';
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-features').value = product.features.join(', ');
        document.getElementById('product-stock').value = product.stock;
        
        document.getElementById('product-modal').classList.add('active');
        
        const form = document.getElementById('product-form');
        form.onsubmit = function(e) {
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
            };
            
            fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })
            .then(response => response.json())
            .then(() => {
                alert('Product updated successfully!');
                closeModal();
                loadProducts();
            })
            .catch(error => {
                console.error('Error updating product:', error);
                alert('Failed to update product');
            });
        };
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
