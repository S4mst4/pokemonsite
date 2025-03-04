// Global state
let decks = [];
let inventory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Fetch decks data
    fetch('assets/data/decks.json')
        .then(response => response.json())
        .then(data => {
            decks = data;
            renderDecks();
        })
        .catch(error => console.error('Error loading decks:', error));

    // Fetch inventory data
    fetch('assets/data/inventory.json')
        .then(response => response.json())
        .then(data => {
            inventory = data;
            renderInventory();
        })
        .catch(error => console.error('Error loading inventory:', error));
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