// Cart management for SuperPokemon app
const cartItems = {
    cards: new Set(),
    decks: new Set(),
    lessons: new Set()
};

let isNewCustomerDiscount = false;
const NEW_CUSTOMER_DISCOUNT = 0.15; // 15% discount
const PRIVATE_LESSON_PRICE = 10.00; // Price for a private lesson

// Add to cart functionality
function addToCart(item, type = 'cards') {
    if (!cartItems[type].has(item.id)) {
        cartItems[type].add(item.id);
        updateCartDisplay();
    }
}

// Remove from cart functionality
function removeFromCart(itemId, type = 'cards') {
    cartItems[type].delete(itemId);
    updateCartDisplay();
}

// Toggle new customer discount
function toggleNewCustomerDiscount() {
    isNewCustomerDiscount = !isNewCustomerDiscount;
    const discountButton = document.getElementById('new-customer-button');
    const discountBanner = document.getElementById('discount-banner');
    const originalPrice = document.querySelector('.original-price');
    const discountLabel = document.querySelector('.discount-label');

    if (isNewCustomerDiscount) {
        discountButton.style.display = 'none';
        discountBanner.classList.remove('hidden');
        originalPrice.classList.remove('hidden');
        discountLabel.classList.remove('hidden');
    } else {
        discountButton.style.display = 'block';
        discountBanner.classList.add('hidden');
        originalPrice.classList.add('hidden');
        discountLabel.classList.add('hidden');
    }
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    // Total items count
    const totalItems = cartItems.cards.size + cartItems.decks.size + cartItems.lessons.size;
    cartCount.textContent = totalItems;

    // Add deck items
    cartItems.decks.forEach(deckId => {
        const deck = DataModule.getDecks().find(d => d.id === deckId);
        if (deck) {
            subtotal += deck.price;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${deck.mainCard.image}" alt="${deck.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${deck.name}</div>
                    <div class="cart-item-price">$${deck.price.toFixed(2)}</div>
                </div>
                <button class="remove-from-cart" data-item-id="${deck.id}" data-item-type="decks">×</button>
            `;
            cartItemsContainer.appendChild(itemElement);

            // Add click handler for remove button
            const removeButton = itemElement.querySelector('.remove-from-cart');
            removeButton.addEventListener('click', () => removeFromCart(deck.id, 'decks'));
        }
    });

    // Add card items
    cartItems.cards.forEach(cardId => {
        const card = DataModule.getCards().find(c => c.id === cardId);
        if (card) {
            const price = card.tcgplayer?.prices?.holofoil?.market || 
                         card.tcgplayer?.prices?.normal?.market || 
                         0;
            subtotal += price;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${card.images.small}" alt="${card.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${card.name}</div>
                    <div class="cart-item-price">$${price}</div>
                </div>
                <button class="remove-from-cart" data-item-id="${card.id}" data-item-type="cards">×</button>
            `;
            cartItemsContainer.appendChild(itemElement);

            // Add click handler for remove button
            const removeButton = itemElement.querySelector('.remove-from-cart');
            removeButton.addEventListener('click', () => removeFromCart(card.id, 'cards'));
        }
    });

    // Add lesson items
    cartItems.lessons.forEach(lessonId => {
        if (lessonId === 'private-lesson') {
            subtotal += PRIVATE_LESSON_PRICE;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="assets/ui/hand.png" alt="Private Lesson">
                <div class="cart-item-details">
                    <div class="cart-item-name">Lección Privada</div>
                    <div class="cart-item-price">$${PRIVATE_LESSON_PRICE.toFixed(2)}</div>
                </div>
                <button class="remove-from-cart" data-item-id="${lessonId}" data-item-type="lessons">×</button>
            `;
            cartItemsContainer.appendChild(itemElement);

            // Add click handler for remove button
            const removeButton = itemElement.querySelector('.remove-from-cart');
            removeButton.addEventListener('click', () => removeFromCart(lessonId, 'lessons'));
        }
    });

    // Update original price
    document.getElementById('original-amount').textContent = subtotal.toFixed(2);

    // Calculate final total with discount if applicable
    const total = isNewCustomerDiscount ? subtotal * (1 - NEW_CUSTOMER_DISCOUNT) : subtotal;
    document.getElementById('cart-total-amount').textContent = total.toFixed(2);

    // Show cart when adding items
    if (totalItems > 0) {
        document.querySelector('.cart').classList.remove('collapsed');
    }
}

// Toggle cart visibility
function toggleCart() {
    const cart = document.querySelector('.cart');
    cart.classList.toggle('collapsed');
}

// Handle checkout
function handleCheckout() {
    if (cartItems.cards.size === 0 && cartItems.decks.size === 0 && cartItems.lessons.size === 0) {
        alert('Your cart is empty!');
        return;
    }

    const cartData = {
        decks: Array.from(cartItems.decks).map(deckId => {
            const deck = DataModule.getDecks().find(d => d.id === deckId);
            return {
                id: deck.id,
                name: deck.name,
                price: deck.price
            };
        }),
        cards: Array.from(cartItems.cards).map(cardId => {
            const card = DataModule.getCards().find(c => c.id === cardId);
            return {
                id: card.id,
                name: card.name,
                price: card.tcgplayer?.prices?.holofoil?.market || 
                       card.tcgplayer?.prices?.normal?.market || 0
            };
        }),
        lessons: Array.from(cartItems.lessons).map(lessonId => ({
            id: lessonId,
            name: 'Lección Privada',
            price: PRIVATE_LESSON_PRICE
        })),
        newCustomerDiscount: isNewCustomerDiscount,
        discountPercentage: isNewCustomerDiscount ? NEW_CUSTOMER_DISCOUNT * 100 : 0,
        subtotal: parseFloat(document.getElementById('original-amount').textContent),
        total: parseFloat(document.getElementById('cart-total-amount').textContent)
    };

    // Create and download the JSON file
    const jsonString = JSON.stringify(cartData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_s4mst4_cart.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const mailtoLink = `mailto:sam@s4mst4.org?subject=Orden De Cartas Pokemon&body=${encodeURIComponent(JSON.stringify(cartData, null, 2))}`;
    window.location.href = mailtoLink;
}

// Export public methods and properties
window.CartModule = {
    addToCart,
    removeFromCart,
    toggleNewCustomerDiscount,
    toggleCart,
    handleCheckout,
    getCartItems: () => cartItems,
    getNewCustomerDiscount: () => isNewCustomerDiscount,
    PRIVATE_LESSON_PRICE
}; 