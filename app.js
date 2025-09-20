// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize speech recognition
    initializeSpeechRecognition();
    
    // Set initial input mode
    setInputMode('text');
    
    // Add welcome message after a short delay
    setTimeout(() => {
        addMessage('ai', 'Welcome to Elixir 24/7! I can help you with health questions, symptom analysis, and medical guidance. What would you like to know?');
    }, 1000);
});