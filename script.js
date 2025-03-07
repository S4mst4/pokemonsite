// Global state
let decks = [];
let cards = [];
let cartItems = {
    cards: new Set(),
    decks: new Set(),
    lessons: new Set()
};
let currentPage = 0;
const cardsPerPage = 20;
let isLoading = false;
let hasMoreCards = true;
let isNewCustomerDiscount = false;
const NEW_CUSTOMER_DISCOUNT = 0.15; // 15% discount
const PRIVATE_LESSON_PRICE = 10.00; // Price for a private lesson

// Function to get URL parameters
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to map URL parameter to section ID
function mapUrlParamToSection(param) {
    const sectionMap = {
        'cartas': 'cards-for-sale',
        'mazos': 'ready-made-decks',
        'clases': 'pokemon-lessons'
    };
    return sectionMap[param] || 'ready-made-decks'; // Default to ready-made-decks if param not found
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check for URL parameters and show appropriate section
    const pageParam = getUrlParam('p');
    if (pageParam) {
        showSection(mapUrlParamToSection(pageParam));
    }

    // Fetch decks data
    fetch('assets/data/decks.json')
        .then(response => response.json())
        .then(data => {
            decks = data;
            renderDecks();
        })
        .catch(error => console.error('Error loading decks:', error));

    // Fetch cards data
    fetch('assets/data/CARDSFROMBOOK.json')
        .then(response => response.json())
        .then(data => {
            cards = data;
            loadMoreCards();
        })
        .catch(error => console.error('Error loading cards:', error));

    // Add infinite scroll listener
    window.addEventListener('scroll', () => {
        if (document.querySelector('#cards-for-sale').classList.contains('active')) {
            handleInfiniteScroll();
        }
    });

    // Add checkout button listener
    document.getElementById('checkout-button').addEventListener('click', handleCheckout);

    // Add cart toggle listener
    document.querySelector('.cart-toggle').addEventListener('click', toggleCart);

    // Add new customer discount button listeners
    document.getElementById('new-customer-button').addEventListener('click', toggleNewCustomerDiscount);
    document.getElementById('discount-banner').addEventListener('click', toggleNewCustomerDiscount);

    // Add private lesson button listener
    document.querySelector('.add-to-cart-lesson').addEventListener('click', () => {
        addToCart({
            id: 'private-lesson',
            name: 'Lección Privada',
            price: PRIVATE_LESSON_PRICE
        }, 'lessons');
    });
});

// Toggle cart visibility
function toggleCart() {
    const cart = document.querySelector('.cart');
    cart.classList.toggle('collapsed');
}

// Handle infinite scroll
function handleInfiniteScroll() {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 1000;
    
    if (endOfPage && !isLoading && hasMoreCards) {
        loadMoreCards();
    }
}

// Load more cards
function loadMoreCards() {
    if (isLoading || !hasMoreCards) return;

    isLoading = true;
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');

    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;
    const cardsToLoad = cards.slice(start, end);

    if (cardsToLoad.length > 0) {
        const container = document.querySelector('.cards-grid');
        
        cardsToLoad.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            const price = card.tcgplayer?.prices?.holofoil?.market || 
                         card.tcgplayer?.prices?.normal?.market || 
                         'Price N/A';
            cardElement.innerHTML = `
                <img src="${card.images.small}" alt="${card.name}" loading="lazy">
                <h3>${card.name}</h3>
                <p class="price">$${price}</p>
                <button class="add-to-cart" data-card-id="${card.id}">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <rect x="11" y="4" width="2" height="16" rx="1" fill="currentColor"/>
                        <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
                    </svg>
                </button>
            `;
            container.appendChild(cardElement);

            // Add click handler for the Add to Cart button
            const addButton = cardElement.querySelector('.add-to-cart');
            addButton.addEventListener('click', () => addToCart(card));
        });

        currentPage++;
        if (end >= cards.length) {
            hasMoreCards = false;
        }
    } else {
        hasMoreCards = false;
    }

    isLoading = false;
    spinner.classList.add('hidden');
}

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

// Apply new customer discount
function applyNewCustomerDiscount() {
    toggleNewCustomerDiscount();
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
        const deck = decks.find(d => d.id === deckId);
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
        const card = cards.find(c => c.id === cardId);
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

// Handle checkout
function handleCheckout() {
    if (cartItems.cards.size === 0 && cartItems.decks.size === 0 && cartItems.lessons.size === 0) {
        alert('Your cart is empty!');
        return;
    }

    const cartData = {
        decks: Array.from(cartItems.decks).map(deckId => {
            const deck = decks.find(d => d.id === deckId);
            return {
                id: deck.id,
                name: deck.name,
                price: deck.price
            };
        }),
        cards: Array.from(cartItems.cards).map(cardId => {
            const card = cards.find(c => c.id === cardId);
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

    const mailtoLink = `mailto:sam@s4mst4.org?subject=Pokemon Card Order&body=${encodeURIComponent(JSON.stringify(cartData, null, 2))}`;
    window.location.href = mailtoLink;
}

// Render the premade decks
function renderDecks() {
    const container = document.querySelector('.deck-container');
    container.innerHTML = decks.map(deck => `
        <div class="deck-card" data-deck-id="${deck.id}">
            <img src="${deck.mainCard.image}" alt="${deck.mainCard.name}">
            <h3>${deck.name}</h3>
            <p>${deck.description}</p>
            <p class="price">$${deck.price.toFixed(2)}</p>
            <button class="add-to-cart-deck" data-deck-id="${deck.id}">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <rect x="11" y="4" width="2" height="16" rx="1" fill="currentColor"/>
                    <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
                </svg>
            </button>
        </div>
    `).join('');

    // Add click handlers for add to cart buttons
    document.querySelectorAll('.add-to-cart-deck').forEach(button => {
        button.addEventListener('click', function() {
            const deckId = this.dataset.deckId;
            const deck = decks.find(d => d.id === deckId);
            addToCart(deck, 'decks');
        });
    });
}

// Render the inventory for custom deck building
function renderInventory() {
    const container = document.querySelector('.special-cards');
    container.innerHTML = inventory.map(card => `
        <div class="card" data-card-id="${card.id}">
            <img src="${card.image}" alt="${card.name}">
            <h3>${card.name}</h3>
            <p class="type">${card.type} - ${card.rarity}</p>
            <p class="price">$${card.price.toFixed(2)}</p>
            <button class="add-to-deck" ${card.inStock ? '' : 'disabled'}>
                ${card.inStock ? 'Add to Deck' : 'Out of Stock'}
            </button>
        </div>
    `).join('');

    // Add click handlers for add to deck buttons
    document.querySelectorAll('.add-to-deck').forEach(button => {
        button.addEventListener('click', function() {
            const cardId = this.parentElement.dataset.cardId;
            const card = inventory.find(c => c.id === cardId);
            alert(`Added ${card.name} to your custom deck!`);
        });
    });
}

// Pokeball cursor animation
const cursor = document.querySelector('.pokeball-cursor');
const root = document.documentElement;

document.addEventListener('mousemove', (e) => {
    cursor.style.display = 'block';
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
});

// Section switching animation
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
            section.classList.add('active');
            section.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            section.classList.add('hidden');
            section.classList.remove('active');
        }
    });
}

// Add hover sound effect to buttons
const buttons = document.querySelectorAll('button');
const hoverSound = new Audio('https://play.pokemonshowdown.com/audio/sfx/generic_click.mp3');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 0.2;
        hoverSound.play();
    });
});

// Random Pokemon animation in the banner
const bannerPokemon = document.querySelectorAll('.banner-pokemon');
setInterval(() => {
    const randomPokemon = bannerPokemon[Math.floor(Math.random() * bannerPokemon.length)];
    randomPokemon.style.animation = 'bounce 0.5s infinite alternate';
    setTimeout(() => {
        randomPokemon.style.animation = '';
    }, 1000);
}, 3000);

// Add keyframe animation for fade in effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

function openGoogleMaps() {
    // Uvita, Costa Rica coordinates
    const uvitaCoordinates = '9.1589,-83.7534';
    const zoomLevel = '13';
    const googleMapsUrl = `https://www.google.com/maps/@${uvitaCoordinates},${zoomLevel}z`;
    window.open(googleMapsUrl, '_blank');
}

// Calendar functionality
let currentDate = new Date();
const modal = document.getElementById('scheduleModal');
const monthDisplay = document.getElementById('currentMonth');

// Classes are held every Saturday from 2-4 PM
const classSchedule = {
    dayOfWeek: 6, // Saturday (0 is Sunday, 6 is Saturday)
    time: '2:00 PM - 4:00 PM'
};

function openScheduleModal() {
    modal.style.display = 'block';
    updateCalendar();
}

function closeScheduleModal() {
    modal.style.display = 'none';
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
}

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    monthDisplay.textContent = `${monthNames[month]} ${year}`;

    // Get first day of the month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Check if this day is a Saturday (class day)
        const currentDayOfWeek = new Date(year, month, day).getDay();
        if (currentDayOfWeek === classSchedule.dayOfWeek) {
            dayElement.classList.add('has-class');
            dayElement.title = `Clase Grupal: ${classSchedule.time}`;
        }

        dayElement.addEventListener('click', () => {
            if (dayElement.classList.contains('has-class')) {
                alert(`Clase Grupal Gratuita\nFecha: ${day} de ${monthNames[month]}, ${year}\nHorario: ${classSchedule.time}`);
            }
        });

        calendarDays.appendChild(dayElement);
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeScheduleModal();
    }
}); 