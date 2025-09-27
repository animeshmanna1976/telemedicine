document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');

        questionButton.addEventListener('click', () => {
            // Toggle the 'active' class on the parent .faq-item
            const isActive = item.classList.contains('active');
            
            // Close all other active items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If the clicked item was not already active, open it
            if (!isActive) {
                item.classList.add('active');
                // Set max-height to the scroll height to animate opening
                answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
            }
        });
    });

    // Optional: Search functionality (can be expanded later)
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', function(event) {
        const searchTerm = event.target.value.toLowerCase();
        // You can add logic here to filter resource cards or FAQs
        console.log("Searching for:", searchTerm); 
    });
});