// --- Configuration ---
const MERCHANT_WHATSAPP_NUMBER = "2348147055742"; 
// CHANGE THIS to your live backend URL (e.g., "https://api.yourdomain.com/api/v1/orders")
const BACKEND_BASE_URL = "http://localhost:8081/api/v1/orders"; 

// --- Theme Switch Toggle Control ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
const htmlElement = document.documentElement;

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = `<i class="fas fa-moon"></i> <span class="toggle-text">Dark Mode</span>`;
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = `<i class="fas fa-sun"></i> <span class="toggle-text">Light Mode</span>`;
    }
});

// --- Responsive Menu Panel Links Drawer ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => { navLinks.classList.toggle('active'); });

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => { navLinks.classList.remove('active'); });
});

// --- Infinite Automatic Slider Loop Carousel ---
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
setInterval(() => {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 5000);

// --- Complete Food Basket Matrix Engine ---
let cartData = [];
const cartCountBadge = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-list');
const subtotalPriceDisplay = document.getElementById('cart-subtotal-price');
const deliveryPriceDisplay = document.getElementById('cart-delivery-price');
const totalPriceDisplay = document.getElementById('cart-total-price');
const hiddenOrderDetails = document.getElementById('hiddenOrderDetails');
const hiddenTotalField = document.getElementById('hiddenTotalField');
const submitOrderBtn = document.getElementById('submitOrderBtn');
const deliveryZoneSelect = document.getElementById('deliveryZone');
const deliveryAddressField = document.getElementById('deliveryAddressField');
const addressLabel = document.getElementById('addressLabel');

deliveryZoneSelect.addEventListener('change', () => {
    if (deliveryZoneSelect.value === 'pickup') {
        addressLabel.textContent = "Physical Delivery Address (Not Required)";
        deliveryAddressField.placeholder = "You have selected Store Pickup.";
        deliveryAddressField.required = false;
        deliveryAddressField.value = "";
    } else {
        addressLabel.textContent = (deliveryZoneSelect.value === 'estate') ? "Estate Apartment Details" : "Full Physical Delivery Address";
        deliveryAddressField.required = true;
    }
    renderUpdatedCartUI();
});

document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        addItemToBasket(card.getAttribute('data-name'), parseInt(card.getAttribute('data-price'), 10), card.getAttribute('data-is-shawarma') === 'true');
    });
});

function addItemToBasket(name, price, isShawarma) {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    cartData.push({ id, name, price, isShawarma, spiceLevel: isShawarma ? "MEDIUM_SPICE" : "NONE" });
    renderUpdatedCartUI();
}

function removeBasketItem(id) {
    cartData = cartData.filter(item => item.id !== id);
    renderUpdatedCartUI();
}

function updateSpicePreference(id, val) {
    const item = cartData.find(i => i.id === id);
    if (item) item.spiceLevel = val.toUpperCase().replace(" ", "_");
}

function renderUpdatedCartUI() {
    cartCountBadge.textContent = cartData.length;
    if (cartData.length === 0) {
        cartItemsContainer.innerHTML = `<p>Your basket is empty.</p>`;
        subtotalPriceDisplay.textContent = "₦0";
        deliveryPriceDisplay.textContent = "₦0";
        totalPriceDisplay.textContent = "₦0";
        submitOrderBtn.disabled = true;
        return;
    }
    cartItemsContainer.innerHTML = "";
    let sub = 0;
    cartData.forEach(item => {
        sub += item.price;
        const row = document.createElement('li');
        row.innerHTML = `<div><h5>${item.name}</h5><span>₦${item.price}</span>${item.isShawarma ? `<select onchange="window.updateSpicePreference('${item.id}', this.value)"><option value="MEDIUM_SPICE">Medium Spice</option><option value="SPICY">Spicy</option><option value="NO_SPICE">No Spice</option></select>` : ''}</div><button onclick="window.removeBasketItem('${item.id}')">Remove</button>`;
        cartItemsContainer.appendChild(row);
    });
    const fee = (deliveryZoneSelect.value === 'estate') ? 500 : 0;
    subtotalPriceDisplay.textContent = "₦" + sub.toLocaleString();
    deliveryPriceDisplay.textContent = "₦" + fee;
    totalPriceDisplay.textContent = "₦" + (sub + fee).toLocaleString();
    submitOrderBtn.disabled = false;
    hiddenOrderDetails.value = cartData.map(i => `${i.name} [${i.spiceLevel}]`).join(' | ');
}

// --- Submission Logic ---
document.getElementById('deliveryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        customerName: document.getElementById('custName').value,
        customerPhone: document.getElementById('custPhone').value,
        fulfillmentMethod: deliveryZoneSelect.value.toUpperCase(),
        deliveryAddress: deliveryAddressField.value || "Walk-In",
        paymentReferenceNotes: document.getElementById('custRemarks').value,
        items: cartData.map(i => ({ name: i.name, quantity: 1, spiceLevel: i.spiceLevel }))
    };

    try {
        const res = await fetch(BACKEND_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert("Order saved!");
            cartData = []; renderUpdatedCartUI();
        } else alert("Error saving order.");
    } catch { alert("Connection failed."); }
    
    // Fallback WhatsApp
    window.open(`https://api.whatsapp.com/send?phone=${MERCHANT_WHATSAPP_NUMBER}&text=${encodeURIComponent("New Order: " + payload.customerName)}`);
});

document.getElementById('retailerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = `New Wholesale Request: ${document.getElementById('retBizName').value}`;
    window.open(`https://api.whatsapp.com/send?phone=${MERCHANT_WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`);
});

window.removeBasketItem = removeBasketItem;
window.updateSpicePreference = updateSpicePreference;
