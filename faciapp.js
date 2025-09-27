document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('patient-search-btn');
    const searchInput = document.getElementById('patient-search-input');
    const patientDetailsSection = document.getElementById('patient-details-section');
    const bookingForm = document.getElementById('booking-form');
    const appointmentsList = document.getElementById('appointments-list');

    // --- Reusable Notification System ---
    const showNotification = (message, type = 'success', duration = 4000) => {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        
        notification.classList.remove('bg-green-500', 'bg-red-500', 'hidden', 'opacity-0');
        
        if (type === 'success') {
            notification.classList.add('bg-green-500');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500');
        }

        notification.classList.remove('hidden');
        setTimeout(() => notification.classList.remove('opacity-0'), 100);

        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.classList.add('hidden'), 500);
        }, duration);
    };

    // --- Mock Patient Search Functionality ---
    const handlePatientSearch = () => {
        const query = searchInput.value.trim();
        if (!query) {
            showNotification('Please enter a patient name or ID.', 'error');
            return;
        }

        showNotification(`Searching for "${query}"...`, 'success', 2000);

        // Simulate an API call
        setTimeout(() => {
            // MOCK DATA: In a real app, this would come from a server
            const patientData = {
                name: 'Gurpreet Singh', // Name changed here
                info: 'Male, 52 Years Old', // Details updated
                id: 'P-67891',
                avatar: 'https://randomuser.me/api/portraits/men/52.jpg', // Avatar updated
                appointments: [
                    {
                        doctor: 'Dr. Priya Singh',
                        department: 'Cardiology',
                        date: '2025-10-15',
                        time: '11:30 AM'
                    }
                ]
            };

            // Update patient details on the page
            document.getElementById('patient-name').textContent = patientData.name;
            document.getElementById('patient-info').textContent = patientData.info;
            document.getElementById('patient-id').textContent = `ID: ${patientData.id}`;
            document.getElementById('patient-avatar').src = patientData.avatar;

            // Update appointments list
            appointmentsList.innerHTML = ''; // Clear existing list
            if (patientData.appointments.length > 0) {
                patientData.appointments.forEach(appt => {
                    const apptElement = document.createElement('div');
                    apptElement.className = 'p-4 bg-gray-100 rounded-lg border border-gray-200';
                    apptElement.innerHTML = `
                        <p class="font-bold text-gray-700">${appt.department} with ${appt.doctor}</p>
                        <p class="text-gray-600">${new Date(appt.date).toDateString()} at ${appt.time}</p>
                    `;
                    appointmentsList.appendChild(apptElement);
                });
            } else {
                appointmentsList.innerHTML = '<p class="text-gray-500">No upcoming appointments found.</p>';
            }
            
            // Show the details and booking section
            patientDetailsSection.classList.remove('hidden');
        }, 1500);
    };
    
    searchBtn.addEventListener('click', handlePatientSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handlePatientSearch();
        }
    });


    // --- Handle New Appointment Booking ---
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const department = document.getElementById('department').value;
        const doctor = document.getElementById('doctor').value;
        const date = document.getElementById('appointment-date').value;

        if (!department || !doctor || !date) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }

        const patientName = document.getElementById('patient-name').textContent;
        showNotification(`Booking appointment for ${patientName}...`, 'success', 2000);

        // Simulate booking process
        setTimeout(() => {
            showNotification('Appointment booked successfully!', 'success');
            bookingForm.reset();
            // In a real app, you would also refresh the appointments list here
        }, 2000);
    });
});