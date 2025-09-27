document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // Added extra padding
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Notification System ---
    const showNotification = (message, type = 'success', duration = 4000) => {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        
        // Reset classes
        notification.classList.remove('bg-green-500', 'bg-red-500', 'hidden', 'opacity-0');
        
        // Set type-specific classes
        if (type === 'success') {
            notification.classList.add('bg-green-500');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500');
        } else { // Default to success
            notification.classList.add('bg-green-500');
        }

        // Show notification
        notification.classList.remove('hidden');
        setTimeout(() => {
            notification.classList.remove('opacity-0');
        }, 100);

        // Hide notification after duration
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 500); // Allow fade-out transition to complete
        }, duration);
    };

    // --- Card Interaction Placeholders ---
    
    const patientOnboardingCard = document.querySelector('.card.border-lime-200');
    if (patientOnboardingCard) {
        patientOnboardingCard.addEventListener('click', () => {
            showNotification('Opening Patient Onboarding...', 'success');
            console.log('Navigate to Patient Onboarding Form');
        });
    }

    const facilitateAppointmentsCard = document.querySelector('.card.border-orange-200');
    if (facilitateAppointmentsCard) {
        facilitateAppointmentsCard.addEventListener('click', () => {
            showNotification('Opening Appointment Facilitation...', 'success');
            console.log('Navigate to Appointment Booking Form');
        });
    }

    const resourceLibraryCard = document.querySelector('.card.border-teal-200');
    if (resourceLibraryCard) {
        resourceLibraryCard.addEventListener('click', () => {
            showNotification('Loading Resource Library...', 'success');
            console.log('Navigate to Resource Library');
        });
    }

    const outreachPlanningCard = document.querySelector('.card.border-fuchsia-200');
    if (outreachPlanningCard) {
        outreachPlanningCard.addEventListener('click', () => {
            showNotification('Opening Outreach Planning...', 'success');
            console.log('Navigate to Outreach Planning Module');
        });
    }

});