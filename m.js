// m.js

// --- Cart Utility Functions (Use localStorage to persist cart data) ---

// Retrieves the cart from localStorage, or returns an empty array
function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

// Saves the cart array to localStorage
function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// --- Main Cart Actions ---

// Function to add an item to the cart
function addToCart(productName, price, size) {
    let cart = getCart();

    // Create a unique identifier for the product (Name + Size)
    const uniqueId = `${productName}-${size}`;

    const existingItem = cart.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
        // If item with same uniqueId exists, increase quantity
        existingItem.quantity += 1;
    } else {
        // Add new item
        cart.push({
            uniqueId: uniqueId, // This is essential for removal
            name: productName,
            price: price,
            quantity: 1,
            size: size 
        });
    }

    saveCart(cart);

    alert(`1 x ${productName} (Size: ${size}) added to cart!`);

    updateCartIconCount(); 
}

// Function to remove an item completely from the cart
function removeItem(uniqueId) {
    let cart = getCart();

    // Filter the cart: keep all items EXCEPT the one with the matching uniqueId
    cart = cart.filter(item => item.uniqueId !== uniqueId);

    saveCart(cart);

    // Re-render the cart items on the page immediately
    displayCartItems();
    
    // Update the count on the cart icon
    updateCartIconCount();
}


// --- Cart Display and Count Functions ---

// Function to update the number on the cart icon (if it exists)
function updateCartIconCount() {
    const cart = getCart();
    // Calculate the total number of items
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const cartIconLink = document.querySelector('.cart-icon-link');

    if (cartIconLink) {
        let countSpan = cartIconLink.querySelector('.cart-count'); 
        if (!countSpan) {
            countSpan = document.createElement('span');
            countSpan.classList.add('cart-count');
            cartIconLink.appendChild(countSpan);
        }
        
        if (totalItems > 0) {
            countSpan.textContent = totalItems;
            countSpan.style.display = 'inline-block';
        } else {
            countSpan.textContent = '';
            countSpan.style.display = 'none'; 
        }
    }
}

// This function builds and displays the cart table on cart.html
function displayCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return; 
    
    const cart = getCart();
    container.innerHTML = ''; 

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-message">Your cart is empty. Start shopping!</p>';
        document.getElementById('cart-total-price').textContent = '$0.00';
        return;
    }

    let overallTotal = 0;

    // Create the cart table structure
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th> 
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    const tbody = table.querySelector('tbody');

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        overallTotal += subtotal;

        const row = document.createElement('tr');
        
        // **CRITICAL FIX HERE**: The onclick now passes the uniqueId to the removeItem function.
        row.innerHTML = `
            <td data-label="Product">${item.name} <br><small>Size: ${item.size}</small></td>
            <td data-label="Price">₹${item.price.toFixed(2)}</td>
            <td data-label="Quantity">${item.quantity}</td>
            <td data-label="Subtotal">₹${subtotal.toFixed(2)}</td>
            <td data-label="Remove">
                <button class="remove-button" onclick="removeItem('${item.uniqueId}')">
                    <i class="ri-close-circle-line"></i> Remove
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    container.appendChild(table);

    // Display the total price
    document.getElementById('cart-total-price').textContent = `₹${overallTotal.toFixed(2)}`;
}


// Run on page load for initial setup
document.addEventListener('DOMContentLoaded', () => {
    updateCartIconCount(); 
    
    // Check if we are on the cart.html page to display items
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
});
// m.js

// ... (Your existing functions like removeItem, getCart, saveCart, etc.) ...

// Function to clear the cart and finalize the order process
function handleCheckoutComplete() {
    // 1. Clear the cart data
    localStorage.removeItem('shoppingCart'); 

    // 2. Update the cart icon count to zero
    updateCartIconCount();

    // 3. Update the message on the checkout page
    const statusElement = document.getElementById('checkout-status');
    if (statusElement) {
        statusElement.innerHTML = `
            <p style="color: green; font-weight: bold;">
                Your cart is now empty, and the order is confirmed.
            </p>
        `;
    }
}