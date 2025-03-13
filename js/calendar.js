// Calendar functionality for SuperPokemon app
let currentDate = new Date();
const monthDisplay = document.getElementById('currentMonth');

// Classes are held every Saturday from 2-4 PM
const classSchedule = {
    dayOfWeek: 6, // Saturday (0 is Sunday, 6 is Saturday)
    time: '2:00 PM - 4:00 PM'
};

function openScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    modal.style.display = 'block';
    updateCalendar();
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
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

// Initialize calendar functionality
function initCalendar() {
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('scheduleModal');
        if (event.target === modal) {
            closeScheduleModal();
        }
    });
}

// Export public methods
window.CalendarModule = {
    openScheduleModal,
    closeScheduleModal,
    previousMonth,
    nextMonth,
    updateCalendar,
    initCalendar
}; 