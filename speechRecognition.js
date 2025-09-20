let recognition = null;
let isRecording = false;

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        // recognition.lang = 'hi-IN';
        recognition.lang = 'en-US'; // Set language to English
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chat-input').value = transcript;
            stopRecording();
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopRecording();
        };
        
        recognition.onend = function() {
            stopRecording();
        };
    }
}

// Start Voice Recording
function startRecording() {
    if (recognition && !isRecording) {
        isRecording = true;
        document.getElementById('voice-recording').classList.add('active');
        recognition.start();
    }
}

// Stop Voice Recording
function stopRecording() {
    if (recognition && isRecording) {
        isRecording = false;
        document.getElementById('voice-recording').classList.remove('active');
        recognition.stop();
    }
}