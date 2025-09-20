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

    // --- Notification System (can be reused from patient dashboard) ---
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
        } else { // Default to success for now
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

    // Example usage (you can trigger these from card clicks or form submissions if you add forms)
    // document.getElementById('some-button-for-success').addEventListener('click', () => {
    //     showNotification('Action completed successfully!', 'success');
    // });

    // document.getElementById('some-button-for-error').addEventListener('click', () => {
    //     showNotification('Failed to perform action.', 'error');
    // });

    // --- Card Interaction Placeholder ---
    // You can add event listeners to the cards here if they lead to specific forms or modals
    // For example:
    const patientOnboardingCard = document.querySelector('.card.border-lime-200');
    patientOnboardingCard.addEventListener('click', () => {
        // In a real app, this would open a modal or navigate to an onboarding form
        showNotification('Opening Patient Onboarding...', 'success');
        console.log('Navigate to Patient Onboarding Form');
        // window.location.href = 'patient-onboarding.html'; // Example navigation
    });

    const facilitateAppointmentsCard = document.querySelector('.card.border-orange-200');
    facilitateAppointmentsCard.addEventListener('click', () => {
        showNotification('Opening Appointment Facilitation...', 'success');
        console.log('Navigate to Appointment Booking Form for patients');
    });

    const communityDashboardCard = document.querySelector('.card.border-sky-200');
    communityDashboardCard.addEventListener('click', () => {
        showNotification('Loading Community Health Dashboard...', 'success');
        console.log('Navigate to Community Health Dashboard');
    });

    // You can add similar listeners for other cards as they become functional
});