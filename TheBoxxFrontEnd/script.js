// --- WhatsApp Destination Merchant Variable Parameter ---
const MERCHANT_WHATSAPP_NUMBER = "2348147055742"; 

// --- Theme Switch Toggle Control (Now initialized for Dark Mode Default) ---
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

hamburger.addEventListener('click', () => { 
    navLinks.classList.toggle('active'); 
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => { 
        navLinks.classList.remove('active'); 
    });
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
        deliveryAddressField.placeholder = "You have selected Store Pickup. No address required.";
        deliveryAddressField.required = false;
        deliveryAddressField.value = "";
    } else if (deliveryZoneSelect.value === 'estate') {
        addressLabel.textContent = "Estate Apartment / Block House Number Address";
        deliveryAddressField.placeholder = "E.g. Block 4, Flat 2, Phase I... *Required*";
        deliveryAddressField.required = true;
    } else {
        addressLabel.textContent = "Full Physical Delivery Address";
        deliveryAddressField.placeholder = "Enter street name, house layout number, estate gate indicators... *Required*";
        deliveryAddressField.required = true;
    }
    renderUpdatedCartUI();
});

document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', (e) => {
        const cardElement = e.target.closest('.product-card');
        const name = cardElement.getAttribute('data-name');
        const price = parseInt(cardElement.getAttribute('data-price'), 10);
        const isShawarma = cardElement.getAttribute('data-is-shawarma') === 'true';
        addItemToBasket(name, price, isShawarma);
    });
});

function addItemToBasket(name, price, isShawarma) {
    const uniqueId = Date.now() + Math.random().toString(36).substr(2, 4);
    let selectedSpice = isShawarma ? "Medium Spice" : "Not Applicable";

    cartData.push({
        id: uniqueId,
        name: name,
        price: price,
        isShawarma: isShawarma,
        spiceLevel: selectedSpice
    });
    renderUpdatedCartUI();
}

function removeBasketItem(itemId) {
    cartData = cartData.filter(item => item.id !== itemId);
    renderUpdatedCartUI();
}

function updateSpicePreference(itemId, newSpiceValue) {
    const targetItem = cartData.find(item => item.id === itemId);
    if (targetItem) {
        targetItem.spiceLevel = newSpiceValue;
    }
    serializeCartToHiddenFields();
}

function renderUpdatedCartUI() {
    cartCountBadge.textContent = cartData.length;

    if (cartData.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-list-notice">Your basket is currently empty. Pick meals from the menu above to build your order list.</p>`;
        subtotalPriceDisplay.textContent = "₦0";
        deliveryPriceDisplay.textContent = "₦0";
        totalPriceDisplay.textContent = "₦0";
        submitOrderBtn.disabled = true;
        return;
    }

    cartItemsContainer.innerHTML = "";
    let foodSubtotalSum = 0;

    cartData.forEach(item => {
        foodSubtotalSum += item.price;
        const rowElement = document.createElement('li');
        rowElement.classList.add('cart-item-row');

        let spiceDropdownHTML = '';
        if (item.isShawarma) {
            spiceDropdownHTML = `
                <select class="spice-selector" onchange="window.updateSpicePreference('${item.id}', this.value)">
                    <option value="Medium Spice" ${item.spiceLevel === "Medium Spice" ? "selected" : ""}>Medium Spice</option>
                    <option value="Spicy" ${item.spiceLevel === "Spicy" ? "selected" : ""}>Spicy 🔥</option>
                    <option value="No Spice" ${item.spiceLevel === "No Spice" ? "selected" : ""}>No Spice ❌</option>
                </select>
            `;
        }

        rowElement.innerHTML = `
            <div class="cart-item-info">
                <h5>${item.name}</h5>
                <span>₦${item.price.toLocaleString()}</span>
                ${spiceDropdownHTML}
            </div>
            <button type="button" class="remove-item-btn" onclick="window.removeBasketItem('${item.id}')">
                <i class="fas fa-trash-alt"></i> Remove
            </button>
        `;
        cartItemsContainer.appendChild(rowElement);
    });

    let deliveryFee = (deliveryZoneSelect.value === 'estate') ? 500 : 0;
    let deliveryLabel = (deliveryZoneSelect.value === 'estate') ? "₦500" : (deliveryZoneSelect.value === 'other' ? "TBD" : "₦0");

    subtotalPriceDisplay.textContent = "₦" + foodSubtotalSum.toLocaleString();
    deliveryPriceDisplay.textContent = deliveryLabel;
    
    const grandTotal = foodSubtotalSum + deliveryFee;
    totalPriceDisplay.textContent = "₦" + grandTotal.toLocaleString();
    submitOrderBtn.disabled = false;

    serializeCartToHiddenFields(foodSubtotalSum, deliveryLabel, grandTotal);
}

function serializeCartToHiddenFields(subtotal, deliveryLabel, grandTotal) {
    if (cartData.length === 0) return;
    const textDigest = cartData.map((item, i) => `${i + 1}. ${item.name} [${item.spiceLevel}]`).join(' | ');
    hiddenOrderDetails.value = `Items: ${textDigest}`;
    hiddenTotalField.value = `Grand Total: ₦${(grandTotal || 0).toLocaleString()}`;
}

// Submit and Dispatch to Email (Formspree handles navigation) + WhatsApp
document.getElementById('deliveryForm').addEventListener('submit', function() {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const method = deliveryZoneSelect.options[deliveryZoneSelect.selectedIndex].text;
    const addr = deliveryAddressField.value || "Walk-In Store Pickup";
    const note = document.getElementById('custRemarks').value;
    const itemsText = cartData.map(item => `  ▪️ ${item.name} (${item.spiceLevel})`).join('\n');
    const totalAmount = totalPriceDisplay.textContent;

    const textPayload = encodeURIComponent(
`🔥 *NEW MEAL BASKET - THE BOXX POSHOP* 🔥
----------------------------------------
👤 *Customer:* ${name}
📞 *Phone:* ${phone}
📍 *Fulfillment:* ${method}
🏠 *Address:* ${addr}
----------------------------------------
🛒 *ITEMS PREPARED:*
${itemsText}
----------------------------------------
💵 *TOTAL AMOUNT PAID:* ${totalAmount}
📝 *Reference:* ${note}
----------------------------------------
⏰ _Sent automatically via Poshop Checkouts._`
    );
    
    setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=${MERCHANT_WHATSAPP_NUMBER}&text=${textPayload}`, '_blank');
    }, 500);
});

// Supermarket Application Submission Dispatch Hook
document.getElementById('retailerForm').addEventListener('submit', function() {
    const bName = document.getElementById('retBizName').value;
    const officer = document.getElementById('retOfficer').value;
    const email = document.getElementById('retEmail').value;
    const phone = document.getElementById('retPhone').value;
    const address = document.getElementById('retAddress').value;
    const targetVolume = document.getElementById('retVolume').value;

    const b2bPayload = encodeURIComponent(
`🏪 *NEW SUPERMARKET WHOLESALE REQUEST* 🏪
----------------------------------------
🏢 *Business Store:* ${bName}
👤 *Officer:* ${officer}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
🗺️ *Location:* ${address}
----------------------------------------
箱 *VOLUME INTEREST:* ${targetVolume} Custom Packs/Cartons
----------------------------------------
💼 _Please review registration parameters to send pricing matrix models._`
    );
    
    setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=${MERCHANT_WHATSAPP_NUMBER}&text=${b2bPayload}`, '_blank');
    }, 500);
});

// --- Explicit Global Scope Mappings for Inline Event Handlers ---
window.removeBasketItem = removeBasketItem;
window.updateSpicePreference = updateSpicePreference;