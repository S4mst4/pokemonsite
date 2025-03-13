// Main initialization for SuperPokemon app

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements and animations
    UIModule.initUI();

    // Initialize calendar functionality
    CalendarModule.initCalendar();

    // Fetch cards data first to ensure cards are loaded before showing sections
    DataModule.loadCards()
        .then(cards => {
            // After cards are loaded, check for URL parameters and show appropriate section
            const pageParam = DataModule.getUrlParam('p');
            if (pageParam) {
                UIModule.showSection(DataModule.mapUrlParamToSection(pageParam));
            } else {
                UIModule.loadMoreCards(); // If no specific section, load cards for default view
            }
        })
        .catch(error => console.error('Error loading cards:', error));

    // Fetch decks data
    DataModule.loadDecks()
        .then(decks => {
            UIModule.renderDecks();
        })
        .catch(error => console.error('Error loading decks:', error));

    // Add infinite scroll listener
    window.addEventListener('scroll', () => {
        UIModule.handleInfiniteScroll();
    });

    // Add checkout button listener
    document.getElementById('checkout-button').addEventListener('click', CartModule.handleCheckout);

    // Add cart toggle listener
    document.querySelector('.cart-toggle').addEventListener('click', CartModule.toggleCart);

    // Add new customer discount button listeners
    document.getElementById('new-customer-button').addEventListener('click', CartModule.toggleNewCustomerDiscount);
    document.getElementById('discount-banner').addEventListener('click', CartModule.toggleNewCustomerDiscount);

    // Add private lesson button listener
    document.querySelector('.add-to-cart-lesson').addEventListener('click', () => {
        CartModule.addToCart({
            id: 'private-lesson',
            name: 'Lección Privada',
            price: CartModule.PRIVATE_LESSON_PRICE
        }, 'lessons');
    });
}); 