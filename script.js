// Global state
const decks = [
    {
        id: "fire-power",
        name: "Fire Power(less noob) Deck",
        description: "It's a fire deck!!",
        price: 25.00,
        mainCard: {
            name: "Charizard VSTAR",
            image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH11/SWSH11_EN_177.png"
        },
        cards: [
            "Charizard VSTAR",
            "Flareon V",
            "Arcanine",
            "Cinderace"
        ]
    },
    {
        id: "psychic-masters",
        name: "Psychic Noob Deck",
        description: "It's a psychic deck!",
        price: 30.00,
        mainCard: {
            name: "Mew VMAX",
            image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH9/SWSH9_EN_154.png"
        },
        cards: [
            "Mew VMAX",
            "Mewtwo V",
            "Espeon",
            "Gardevoir"
        ]
    }
];

const inventory = [
    {
        id: "pikachu-v",
        name: "Pikachu V",
        price: 8.00,
        image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH10/SWSH10_EN_172.png",
        type: "Electric",
        rarity: "V",
        inStock: true
    },
    {
        id: "mewtwo-vstar",
        name: "Mewtwo VSTAR",
        price: 15.00,
        image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH9/SWSH9_EN_114.png",
        type: "Psychic",
        rarity: "VSTAR",
        inStock: true
    },
    {
        id: "gengar-vmax",
        name: "Gengar VMAX",
        price: 12.00,
        image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH8/SWSH8_EN_157.png",
        type: "Psychic",
        rarity: "VMAX",
        inStock: true
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderDecks();
    renderInventory();
});

// Render the premade decks
function renderDecks() {
    const container = document.querySelector('.deck-container');
    container.innerHTML = decks.map(deck => `
        <div class="deck-card" data-deck-id="${deck.id}">
            <img src="${deck.mainCard.image}" alt="${deck.mainCard.name}">
            <h3>${deck.name}</h3>
            <p>${deck.description}</p>
            <p class="price">$${deck.price.toFixed(2)}</p>
            <button class="buy-button">Buy Now</button>
        </div>
    `).join('');

    // Add click handlers for buy buttons
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
            const deckId = this.parentElement.dataset.deckId;
            const deck = decks.find(d => d.id === deckId);
            alert(`Thanks for your interest in the ${deck.name}!\nPrice: $${deck.price.toFixed(2)}\n\nPlease ask your parents to help you with the purchase!`);
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

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    selectedSection.classList.remove('hidden');
    selectedSection.classList.add('active');
} 