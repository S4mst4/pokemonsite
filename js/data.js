// Data management for SuperPokemon app
// Global state
let decks = [];
let cards = [];
let hasMoreCards = true;
let currentPage = 0;
const cardsPerPage = 20;
let isLoading = false;

// Load cards data from JSON file
function loadCards() {
    return fetch('assets/data/CARDSFROMBOOK.json')
        .then(response => response.json())
        .then(data => {
            cards = data;
            return cards;
        })
        .catch(error => console.error('Error loading cards:', error));
}

// Load decks data from JSON file
function loadDecks() {
    return fetch('assets/data/decks.json')
        .then(response => response.json())
        .then(data => {
            decks = data;
            return decks;
        })
        .catch(error => console.error('Error loading decks:', error));
}

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
        'clases': 'pokemon-lessons',
        'todos': 'all'
    };
    return sectionMap[param] || 'all'; // Default to showing all if param not found
}

// Update URL parameter without refreshing the page
function updateUrlParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// Export public methods and properties
window.DataModule = {
    loadCards,
    loadDecks,
    getUrlParam,
    mapUrlParamToSection,
    updateUrlParam,
    getCards: () => cards,
    getDecks: () => decks,
    getCardsPerPage: () => cardsPerPage,
    getCurrentPage: () => currentPage,
    incrementPage: () => { currentPage++; },
    hasMoreCards: () => hasMoreCards,
    setHasMoreCards: (value) => { hasMoreCards = value; },
    isLoading: () => isLoading,
    setLoading: (value) => { isLoading = value; }
}; 