// State
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartIcon = document.getElementById('cart-icon');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalAmount = document.getElementById('cart-total-amount');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
function init() {
    renderProducts();
    loadCartFromStorage();
    setupEventListeners();
}

// Render Products
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function toggleCart() {
    cartOverlay.classList.toggle('active');
    cartSidebar.classList.toggle('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    // Open cart automatically when adding item
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update items display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <div class="item-title">${item.name}</div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <div class="remove-item" onclick="removeFromCart(${item.id})">Remove</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;

    // Save to localStorage
    saveCartToStorage();
}

// Storage
function saveCartToStorage() {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('ecommerce_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// Event Listeners
function setupEventListeners() {
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) toggleCart();
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert(`Checkout simulated!\nTotal amount: ${cartTotalAmount.textContent}\nThank you for your purchase!`);
        cart = [];
        updateCart();
        toggleCart();
    });
}

// Run app
document.addEventListener('DOMContentLoaded', init);

