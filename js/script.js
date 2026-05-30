// ==================== DOM ELEMENT SELECTIONS ====================
// Select main product display container
const productContainer = document.getElementById("product-container");

// Search functionality elements
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-btn");

// Cart toggle button
const cartToggle = document.getElementById("cart");

// Category filter buttons (returns NodeList)
const categoryButtons = document.querySelectorAll(".categories");

// Shopping cart sidebar elements
const cartSidebar = document.querySelector(".list-buy");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceDisplay = document.getElementById("total-amount");
const checkoutButton = document.getElementById("checkout-btn");

// Pagination elements
const paginationButtons = document.querySelectorAll(".pagination-box");

// ==================== GLOBAL STATE VARIABLES ====================
// Store all fetched products
let allProducts = [];

// Store cart items with quantities
let cartItems = [];

// Pagination configuration
const ITEMS_PER_PAGE = 9; // Number of products to show per page

// ==================== PAGINATION FUNCTIONALITY ====================
/**
 * Sets up pagination click handlers
 * Each button click shows corresponding page of products
 */
paginationButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        // Remove active class from all pagination buttons
        paginationButtons.forEach(btn => btn.classList.remove("active"));
        
        // Add active class to clicked button
        button.classList.add("active");
        
        // Parse page number (index + 1 since index starts at 0)
        const currentPage = index + 1;
        
        // Calculate start index for array slicing
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        
        // Get products for current page
        const currentPageProducts = allProducts.slice(
            startIndex, 
            startIndex + ITEMS_PER_PAGE
        );
        
        // Render paginated products
        renderProducts(currentPageProducts);
        
        console.log(`Switched to page ${currentPage}, showing ${currentPageProducts.length} products`);
    });
});

// Set first pagination button as active by default
if (paginationButtons.length > 0) {
    paginationButtons[0].classList.add("active");
}

// ==================== API DATA FETCHING ====================
/**
 * Fetches products from FakeStore API
 * @async
 * @function fetchProducts
 * 
 * API Endpoint: https://fakestoreapi.com/products
 * Returns: Array of product objects
 */
async function fetchProducts() {
    try {
        // Show loading state
        productContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p>Loading products...</p>
            </div>
        `;
        
        // Fetch data from API
        const response = await fetch("https://fakestoreapi.com/products");
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        console.log("Products fetched successfully:", data);
        
        // Store all products in global variable
        allProducts = data;
        
        // Display first page initially (first 9 products)
        renderProducts(allProducts.slice(0, ITEMS_PER_PAGE));
        
    } catch (error) {
        console.error("Error fetching products:", error);
        productContainer.innerHTML = `
            <div class="error-message" style="grid-column: 1/-1;">
                <p>Failed to load products. Please try again later.</p>
                <button onclick="fetchProducts()" style="margin-top: 10px; padding: 10px 20px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }
}

// ==================== PRODUCT RENDERING ====================
/**
 * Renders product cards in the product container
 * @param {Array} products - Array of product objects to display
 */
function renderProducts(products) {
    // Clear existing products
    productContainer.innerHTML = "";
    
    // Check if products array is empty
    if (!products || products.length === 0) {
        productContainer.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1;">
                <p>No products found</p>
            </div>
        `;
        return;
    }
    
    console.log(`Rendering ${products.length} products`);
    
    // Generate HTML for each product
    products.forEach((product) => {
        // Create product card HTML
        const productHTML = `
            <div class="product-box">
                <img 
                    src="${product.image}" 
                    alt="${product.title}"
                    class="product-picture"
                    loading="lazy"
                >
                
                <div class="product-description">
                    <p title="${product.title}">${product.title}</p>
                    <p>Price</p>
                    <p>$ ${product.price.toFixed(2)}</p>
                    <button 
                        class="button-cart" 
                        data-id="${product.id}"
                        aria-label="Add ${product.title} to cart"
                    >
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        // Append to container
        productContainer.innerHTML += productHTML;
    });
}

// ==================== SEARCH FUNCTIONALITY ====================
/**
 * Handles product search functionality
 * Filters products based on search input value
 */
searchButton.addEventListener("click", () => {
    performSearch();
});

// Search on Enter key press
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});

/**
 * Performs the actual search filtering
 */
function performSearch() {
    // Get and clean search input
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // If search is empty, show first page of all products
    if (searchTerm === "") {
        renderProducts(allProducts.slice(0, ITEMS_PER_PAGE));
        // Reset pagination to first page
        paginationButtons.forEach(btn => btn.classList.remove("active"));
        if (paginationButtons.length > 0) {
            paginationButtons[0].classList.add("active");
        }
        return;
    }
    
    // Filter products based on search term (check both title and description)
    const filteredProducts = allProducts.filter((product) => {
        return product.title.toLowerCase().includes(searchTerm) ||
               product.description.toLowerCase().includes(searchTerm);
    });
    
    // Render filtered products
    renderProducts(filteredProducts);
    
    console.log(`Found ${filteredProducts.length} products matching "${searchTerm}"`);
}

// ==================== CATEGORY FILTERING ====================
/**
 * Sets up category filter buttons with visual feedback
 * Each button has data-category attribute
 */
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Remove 'active' class from ALL category buttons
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });
        
        // Add 'active' class to clicked button
        button.classList.add("active");
        
        // Get category from button's data attribute
        const selectedCategory = button.dataset.category;
        
        console.log(`Category selected: ${selectedCategory}`);
        
        // Handle "all" category - show first page of all products
        if (selectedCategory === "all") {
            renderProducts(allProducts.slice(0, ITEMS_PER_PAGE));
            // Reset pagination to first page
            paginationButtons.forEach(btn => btn.classList.remove("active"));
            if (paginationButtons.length > 0) {
                paginationButtons[0].classList.add("active");
            }
            return;
        }
        
        // Filter products by selected category
        const filteredProducts = allProducts.filter((product) => {
            return product.category === selectedCategory;
        });
        
        // Render filtered products
        renderProducts(filteredProducts);
        
        console.log(`Found ${filteredProducts.length} products in category "${selectedCategory}"`);
    });
});

// ==================== CART FUNCTIONALITY ====================
/**
 * Handles adding products to cart using event delegation
 * @param {Event} event - Click event from product container
 */
productContainer.addEventListener("click", (event) => {
    // Check if clicked element is add to cart button
    if (!event.target.classList.contains("button-cart")) {
        return; // Exit if not cart button
    }
    
    // Get product ID from button's data attribute
    const productId = parseInt(event.target.dataset.id);
    
    // Find the product in all products array
    const selectedProduct = allProducts.find((item) => item.id === productId);
    
    if (!selectedProduct) {
        console.error(`Product with ID ${productId} not found`);
        return;
    }
    
    // Check if product already exists in cart
    const existingCartItem = cartItems.find((item) => item.id === productId);
    
    if (existingCartItem) {
        // Product already in cart - increase quantity
        existingCartItem.quantity += 1;
        console.log(`Increased quantity for: ${selectedProduct.title} (now ${existingCartItem.quantity})`);
    } else {
        // New product - add to cart with quantity 1
        cartItems.push({
            ...selectedProduct,  // Spread all product properties
            quantity: 1          // Add quantity property
        });
        console.log(`Added to cart: ${selectedProduct.title}`);
    }
    
    // Update cart display
    renderCart();
    
    // Show brief animation or notification
    showAddToCartFeedback(event.target);
});

/**
 * Shows visual feedback when item is added to cart
 * @param {HTMLElement} button - The button that was clicked
 */
function showAddToCartFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = "✓ Added!";
    button.style.background = "#22c55e";
    button.style.color = "white";
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = "#f97316";
    }, 1000);
}

// ==================== CART TOGGLE ====================
/**
 * Toggles cart sidebar visibility
 */
cartToggle.addEventListener("click", () => {
    cartSidebar.classList.toggle("hidden");
    
    // Update cart button text based on cart state
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartSidebar.classList.contains("hidden")) {
        cartToggle.textContent = totalItems > 0 ? `🛒 Cart (${totalItems})` : "🛒 Cart";
    } else {
        cartToggle.textContent = `🛒 Cart (${totalItems})`;
    }
});

// ==================== CART RENDERING ====================
/**
 * Renders cart items and updates total price
 * Called after any cart modification
 */
function renderCart() {
    // Clear existing cart items
    cartItemsContainer.innerHTML = "";
    
    let grandTotal = 0;
    
    // Handle empty cart
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <p>Add some products to get started!</p>
            </div>
        `;
        totalPriceDisplay.textContent = "$0.00";
        return;
    }
    
    // Render each cart item
    cartItems.forEach((product) => {
        // Calculate total for this item
        const itemTotal = product.price * product.quantity;
        grandTotal += itemTotal;
        
        // Create cart item HTML
        const cartItemHTML = `
            <div class="cart-item">
                <div class="product-info">
                    <img 
                        src="${product.image}" 
                        alt="${product.title}"
                        class="img-product"
                    >
                    <p title="${product.title}">${product.title}</p>
                </div>
                
                <div class="qty">
                    <button 
                        class="qty-button" 
                        data-action="decrease" 
                        data-id="${product.id}"
                        aria-label="Decrease quantity of ${product.title}"
                    >-</button>
                    <span>${product.quantity}</span>
                    <button 
                        class="qty-button" 
                        data-action="increase" 
                        data-id="${product.id}"
                        aria-label="Increase quantity of ${product.title}"
                    >+</button>
                </div>
                
                <div class="price">
                    <p>$ ${product.price.toFixed(2)}</p>
                </div>
                
                <div class="total">
                    <p>$ ${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
        
        // Append to cart container
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    
    // Update total price display
    totalPriceDisplay.textContent = `$ ${grandTotal.toFixed(2)}`;
    
    // Update cart button counter
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartToggle.textContent = totalItems > 0 ? `🛒 Cart (${totalItems})` : "🛒 Cart";
}

// ==================== CART QUANTITY MANAGEMENT ====================
/**
 * Handles quantity increase/decrease in cart using event delegation
 * @param {Event} event - Click event from cart items container
 */
cartItemsContainer.addEventListener("click", (event) => {
    // Check if clicked element is quantity button
    if (!event.target.classList.contains("qty-button")) {
        return;
    }
    
    // Get product ID and action from button's data attributes
    const productId = parseInt(event.target.dataset.id);
    const action = event.target.dataset.action;
    
    // Find the item in cart
    const cartItem = cartItems.find((product) => product.id === productId);
    
    if (!cartItem) {
        console.error(`Cart item with ID ${productId} not found`);
        return;
    }
    
    // Handle quantity increase
    if (action === "increase") {
        cartItem.quantity += 1;
        console.log(`Increased quantity of ${cartItem.title} to ${cartItem.quantity}`);
    }
    
    // Handle quantity decrease
    if (action === "decrease") {
        cartItem.quantity -= 1;
        
        // Remove item if quantity reaches 0
        if (cartItem.quantity <= 0) {
            cartItems = cartItems.filter((product) => product.id !== productId);
            console.log(`Removed ${cartItem.title} from cart`);
        } else {
            console.log(`Decreased quantity of ${cartItem.title} to ${cartItem.quantity}`);
        }
    }
    
    // Update cart display
    renderCart();
});

// ==================== CHECKOUT FUNCTIONALITY ====================
/**
 * Handles checkout process
 */
checkoutButton.addEventListener("click", () => {
    // Check if cart is empty
    if (cartItems.length === 0) {
        alert("Your cart is empty. Add some products before checkout.");
        return;
    }
    
    // Calculate order summary
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
    );
    
    // Show order confirmation
    const confirmMessage = `Order Summary:\n\nItems: ${totalItems}\nTotal: $${totalPrice.toFixed(2)}\n\nConfirm your purchase?`;
    
    if (confirm(confirmMessage)) {
        // Clear cart after successful checkout
        cartItems = [];
        renderCart();
        cartSidebar.classList.add("hidden");
        cartToggle.textContent = "🛒 Cart";
        
        alert("Thank you for your purchase! Your order has been placed successfully.");
        console.log("Order completed:", {
            items: totalItems,
            total: totalPrice,
            timestamp: new Date().toISOString()
        });
    }
});

// ==================== INITIALIZATION ====================
/**
 * Initialize the application
 */
function initializeApp() {
    console.log("🚀 Initializing RRZE Store...");
    
    // Render empty cart
    renderCart();
    
    // Fetch products from API
    fetchProducts();
    
    console.log("✅ Store initialized successfully!");
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});