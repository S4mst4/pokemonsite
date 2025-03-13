// UI management for SuperPokemon app

// Load more cards
function loadMoreCards() {
    if (DataModule.isLoading() || !DataModule.hasMoreCards()) return;

    DataModule.setLoading(true);
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');

    const start = DataModule.getCurrentPage() * DataModule.getCardsPerPage();
    const end = start + DataModule.getCardsPerPage();
    
    // Make sure we have cards loaded before trying to slice them
    const cards = DataModule.getCards();
    if (cards.length === 0) {
        // Cards haven't been loaded yet, retry after a short delay
        DataModule.setLoading(false);
        spinner.classList.add('hidden');
        setTimeout(loadMoreCards, 500);
        return;
    }
    
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
            addButton.addEventListener('click', () => CartModule.addToCart(card));
        });

        DataModule.incrementPage();
        if (end >= cards.length) {
            DataModule.setHasMoreCards(false);
        }
    } else {
        DataModule.setHasMoreCards(false);
    }

    DataModule.setLoading(false);
    spinner.classList.add('hidden');
}

// Handle infinite scroll
function handleInfiniteScroll() {
    const cardsSection = document.getElementById('cards-for-sale');
    
    // Only load more cards if the cards section is visible
    if (!cardsSection.classList.contains('hidden') && !DataModule.isLoading() && DataModule.hasMoreCards()) {
        const endOfPage = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 1000;
        if (endOfPage) {
            loadMoreCards();
        }
    }
}

// Section switching animation
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    const navButtons = document.querySelectorAll('.pokemon-nav .pokeball-button');

    // Update active button style
    navButtons.forEach(button => {
        if (button.textContent.trim() === 'Todos' && sectionId === 'all') {
            button.classList.add('active-nav');
        } else if (button.getAttribute('onclick').includes(sectionId) && sectionId !== 'all') {
            button.classList.add('active-nav');
        } else {
            button.classList.remove('active-nav');
        }
    });

    // Show/hide appropriate sections
    if (sectionId === 'all') {
        // Show all sections
        sections.forEach(section => {
            section.classList.remove('hidden');
            section.classList.add('active');
            section.style.animation = 'fadeIn 0.5s ease-in-out';
        });

        // Update URL parameter
        DataModule.updateUrlParam('p', 'todos');
    } else {
        // Show only the selected section
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

        // Update URL parameter
        const paramMap = {
            'ready-made-decks': 'mazos',
            'cards-for-sale': 'cartas',
            'pokemon-lessons': 'clases'
        };
        DataModule.updateUrlParam('p', paramMap[sectionId] || 'todos');
    }

    // Make sure infinite scroll works properly for cards section
    if (sectionId === 'all' || sectionId === 'cards-for-sale') {
        // Load more cards if needed
        handleInfiniteScroll();
    }
}

// Render the premade decks
function renderDecks() {
    const container = document.querySelector('.deck-container');
    const decks = DataModule.getDecks();
    
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
            CartModule.addToCart(deck, 'decks');
        });
    });
}

// Open Google Maps
function openGoogleMaps() {
    // Uvita, Costa Rica coordinates
    const uvitaCoordinates = '9.1589,-83.7534';
    const zoomLevel = '13';
    const googleMapsUrl = `https://www.google.com/maps/@${uvitaCoordinates},${zoomLevel}z`;
    window.open(googleMapsUrl, '_blank');
}

// Pokeball cursor animation
function initPokemonCursor() {
    const cursor = document.querySelector('.pokeball-cursor');

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
}

// Random Pokemon animation in the banner
function initBannerAnimation() {
    const bannerPokemon = document.querySelectorAll('.banner-pokemon');
    setInterval(() => {
        const randomPokemon = bannerPokemon[Math.floor(Math.random() * bannerPokemon.length)];
        randomPokemon.style.animation = 'bounce 0.5s infinite alternate';
        setTimeout(() => {
            randomPokemon.style.animation = '';
        }, 1000);
    }, 3000);
}

// Add hover sound effect to buttons
function initButtonSounds() {
    const buttons = document.querySelectorAll('button');
    const hoverSound = new Audio('https://play.pokemonshowdown.com/audio/sfx/generic_click.mp3');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.volume = 0.2;
            hoverSound.play();
        });
    });
}

// Add keyframe animation for fade in effect
function initFadeInAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize UI elements and animations
function initUI() {
    initPokemonCursor();
    initBannerAnimation();
    initButtonSounds();
    initFadeInAnimation();
}

// Export public methods
window.UIModule = {
    loadMoreCards,
    handleInfiniteScroll,
    showSection,
    renderDecks,
    openGoogleMaps,
    initUI
}; 