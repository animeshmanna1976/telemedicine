document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const notification = document.getElementById('notification');
    const eventForm = document.getElementById('event-form');
    const activityList = document.getElementById('activity-list');
    const noActivities = document.getElementById('no-activities');
    const btnUpcoming = document.getElementById('btn-upcoming');
    const btnPast = document.getElementById('btn-past');
    
    let currentView = 'upcoming'; // Default view

    // --- Utility Functions ---

    // Simple notification display
    const showNotification = (message, type = 'success', duration = 4000) => {
        notification.textContent = message;
        notification.classList.remove('bg-green-500', 'bg-red-500', 'hidden', 'opacity-0');
        notification.classList.add(type === 'error' ? 'bg-red-500' : 'bg-green-500');

        notification.classList.remove('hidden');
        setTimeout(() => notification.classList.remove('opacity-0'), 100);

        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.classList.add('hidden'), 500);
        }, duration);
    };

    // Load activities from local storage
    const loadActivities = () => {
        const activitiesJson = localStorage.getItem('outreachActivities');
        return activitiesJson ? JSON.parse(activitiesJson) : [];
    };

    // Save activities to local storage
    const saveActivities = (activities) => {
        localStorage.setItem('outreachActivities', JSON.stringify(activities));
    };

    // Render the activity list based on the current view
    const renderActivities = () => {
        const activities = loadActivities();
        const now = new Date();
        
        // Filter based on view ('upcoming' or 'past')
        const filteredActivities = activities.filter(activity => {
            const activityDate = new Date(activity.date + 'T' + activity['start-time']);
            return currentView === 'upcoming' ? activityDate >= now : activityDate < now;
        }).sort((a, b) => {
            // Sort by date/time (Upcoming ascending, Past descending)
            const dateA = new Date(a.date + 'T' + a['start-time']);
            const dateB = new Date(b.date + 'T' + b['start-time']);
            return currentView === 'upcoming' ? dateA - dateB : dateB - dateA;
        });

        activityList.innerHTML = '';
        
        if (filteredActivities.length === 0) {
            noActivities.textContent = `No ${currentView} activities scheduled.`;
            activityList.appendChild(noActivities);
            return;
        }

        filteredActivities.forEach(activity => {
            const dateObj = new Date(activity.date);
            const dateDisplay = dateObj.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const card = document.createElement('div');
            card.className = 'p-5 bg-white rounded-xl shadow-md flex justify-between items-center transition-shadow hover:shadow-lg border-l-4 border-fuchsia-500';
            
            card.innerHTML = `
                <div>
                    <p class="text-lg font-bold text-fuchsia-700">${activity['activity-type']} - ${activity['target-village']}</p>
                    <p class="text-sm text-gray-600 mt-1">
                        <i class="far fa-calendar-alt mr-1"></i> ${dateDisplay} at ${activity['start-time']} (${activity.duration} hrs)
                    </p>
                    <p class="text-sm text-gray-500 mt-2 italic max-w-lg">${activity.notes}</p>
                </div>
                <button data-id="${activity.id}" class="delete-btn text-red-500 hover:text-red-700 transition-colors text-xl">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            activityList.appendChild(card);
        });
        
        // Add delete event listeners after rendering
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    };
    
    // --- Event Handlers ---

    // Handle form submission
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newActivity = {
            id: Date.now(),
            'activity-type': document.getElementById('activity-type').value,
            'target-village': document.getElementById('target-village').value,
            date: document.getElementById('date').value,
            'start-time': document.getElementById('start-time').value,
            duration: document.getElementById('duration').value,
            notes: document.getElementById('notes').value
        };

        const activities = loadActivities();
        activities.push(newActivity);
        saveActivities(activities);
        
        eventForm.reset();
        showNotification('Activity scheduled successfully!');
        renderActivities();
    });

    // Handle activity deletion
    const handleDelete = (e) => {
        const button = e.currentTarget;
        const idToDelete = parseInt(button.dataset.id);
        
        if (confirm("Are you sure you want to delete this activity?")) {
            let activities = loadActivities();
            activities = activities.filter(activity => activity.id !== idToDelete);
            saveActivities(activities);
            showNotification('Activity deleted.', 'error');
            renderActivities();
        }
    };

    // Handle view switching
    const switchView = (view) => {
        currentView = view;
        
        btnUpcoming.classList.toggle('bg-fuchsia-500', view === 'upcoming');
        btnUpcoming.classList.toggle('text-white', view === 'upcoming');
        btnUpcoming.classList.toggle('bg-gray-300', view !== 'upcoming');
        btnUpcoming.classList.toggle('text-gray-700', view !== 'upcoming');

        btnPast.classList.toggle('bg-fuchsia-500', view === 'past');
        btnPast.classList.toggle('text-white', view === 'past');
        btnPast.classList.toggle('bg-gray-300', view !== 'past');
        btnPast.classList.toggle('text-gray-700', view !== 'past');

        renderActivities();
    };

    btnUpcoming.addEventListener('click', () => switchView('upcoming'));
    btnPast.addEventListener('click', () => switchView('past'));

    // Initial load
    renderActivities();
});