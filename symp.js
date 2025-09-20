// DOM Elements
const textInputBtn = document.getElementById('text-input-btn');
const voiceInputBtn = document.getElementById('voice-input-btn');
const imageInputBtn = document.getElementById('image-input-btn');
const textInputArea = document.getElementById('text-input-area');
const voiceInputArea = document.getElementById('voice-input-area');
const imageInputArea = document.getElementById('image-input-area');
const symptomText = document.getElementById('symptom-text');
const submitTextBtn = document.getElementById('submit-text-btn');
const startRecordingBtn = document.getElementById('start-recording');
const stopRecordingBtn = document.getElementById('stop-recording');
const recordingStatus = document.getElementById('recording-status');
const imageUploadChat = document.getElementById('image-upload-chat');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const analyzeImageBtn = document.getElementById('analyze-image-btn');
const chatMessages = document.getElementById('chat-messages');

// Input option buttons
const inputOptions = document.querySelectorAll('.input-option');

// Set active input option
function setActiveOption(option) {
    inputOptions.forEach(opt => {
        opt.classList.remove('active');
        opt.classList.remove('border-blue-400', 'border-green-400', 'border-purple-400');
    });
    
    option.classList.add('active');
    
    // Add specific border color based on option type
    if (option.querySelector('.fa-keyboard')) {
        option.classList.add('border-blue-400');
    } else if (option.querySelector('.fa-microphone')) {
        option.classList.add('border-green-400');
    } else if (option.querySelector('.fa-image')) {
        option.classList.add('border-purple-400');
    }
}

// Text input handler
textInputBtn.addEventListener('click', () => {
    setActiveOption(textInputBtn.closest('.input-option'));
    textInputArea.classList.remove('hidden');
    voiceInputArea.classList.add('hidden');
    imageInputArea.classList.add('hidden');
});

// Voice input handler
voiceInputBtn.addEventListener('click', () => {
    setActiveOption(voiceInputBtn.closest('.input-option'));
    textInputArea.classList.add('hidden');
    voiceInputArea.classList.remove('hidden');
    imageInputArea.classList.add('hidden');
});

// Image input handler
imageInputBtn.addEventListener('click', () => {
    setActiveOption(imageInputBtn.closest('.input-option'));
    document.getElementById('image-upload').click();
});

document.getElementById('image-upload').addEventListener('change', handleImageUpload);
imageUploadChat.addEventListener('change', handleImageUpload);

function handleImageUpload(e) {
    setActiveOption(imageInputBtn.closest('.input-option'));
    textInputArea.classList.add('hidden');
    voiceInputArea.classList.add('hidden');
    imageInputArea.classList.remove('hidden');
    
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewImg.src = event.target.result;
            imagePreview.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
}

// Submit text symptoms
submitTextBtn.addEventListener('click', () => {
    const symptoms = symptomText.value.trim();
    if (symptoms) {
        addMessage(symptoms, 'user');
        symptomText.value = '';
        
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'bot-message p-4 shadow-sm';
        loadingDiv.innerHTML = `
            <div class="flex items-center">
                <div class="loader mr-3"></div>
                <span class="text-gray-600">Analyzing your symptoms...</span>
            </div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            chatMessages.removeChild(loadingDiv);
            generateResponse(symptoms, 'text');
        }, 2000);
    }
});

// Voice recording functionality
let recognition;
let isRecording = false;

// Check if browser supports speech recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = function() {
        isRecording = true;
        startRecordingBtn.classList.add('hidden');
        stopRecordingBtn.classList.remove('hidden');
        recordingStatus.textContent = 'Listening...';
    };
    
    recognition.onresult = function(event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        recordingStatus.textContent = transcript;
    };
    
    recognition.onend = function() {
        isRecording = false;
        startRecordingBtn.classList.remove('hidden');
        stopRecordingBtn.classList.add('hidden');
        
        const finalTranscript = recordingStatus.textContent;
        if (finalTranscript) {
            addMessage(finalTranscript, 'user');
            
            // Show loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'bot-message p-4 shadow-sm';
            loadingDiv.innerHTML = `
                <div class="flex items-center">
                    <div class="loader mr-3"></div>
                    <span class="text-gray-600">Analyzing your symptoms...</span>
                </div>
            `;
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate API call (replace with actual API call)
            setTimeout(() => {
                chatMessages.removeChild(loadingDiv);
                generateResponse(finalTranscript, 'voice');
            }, 2000);
        }
        
        recordingStatus.textContent = '';
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        recordingStatus.textContent = 'Error: ' + event.error;
        isRecording = false;
        startRecordingBtn.classList.remove('hidden');
        stopRecordingBtn.classList.add('hidden');
    };
} else {
    recordingStatus.textContent = 'Speech recognition not supported in this browser';
    startRecordingBtn.disabled = true;
}

startRecordingBtn.addEventListener('click', () => {
    if (!isRecording) {
        recognition.start();
    }
});

stopRecordingBtn.addEventListener('click', () => {
    if (isRecording) {
        recognition.stop();
    }
});

// Analyze image
analyzeImageBtn.addEventListener('click', () => {
    const imageDescription = "Skin condition image"; // In a real app, you would analyze the image
    
    addMessage("Image of affected area", 'user');
    imagePreview.classList.add('hidden');
    
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'bot-message p-4 shadow-sm';
    loadingDiv.innerHTML = `
        <div class="flex items-center">
            <div class="loader mr-3"></div>
            <span class="text-gray-600">Analyzing your image...</span>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        chatMessages.removeChild(loadingDiv);
        generateResponse(imageDescription, 'image');
    }, 3000);
});

// Add message to chat
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message p-4 shadow-sm' : 'bot-message p-4 shadow-sm';
    
    if (sender === 'user') {
        messageDiv.innerHTML = `<p class="text-gray-700">${message}</p>`;
    } else {
        messageDiv.innerHTML = message;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate AI response (simulated)
function generateResponse(input, inputType) {
    // This is a simulated response - in a real application, you would call an AI API
    
    let response = '';
    
    if (inputType === 'image') {
        response = `
            <p class="text-gray-700 mb-3">Based on the image you provided, I'm detecting signs that might indicate a skin condition. Please note that image analysis is limited and should be verified by a healthcare professional.</p>
            <p class="font-semibold mb-2">Suggested steps:</p>
            <ul class="list-disc pl-5 mb-3 text-gray-700">
                <li>Keep the area clean and dry</li>
                <li>Avoid scratching or irritating the area</li>
                <li>Monitor for changes in size, color, or texture</li>
                <li>Consider consulting a dermatologist for proper diagnosis</li>
            </ul>
            <p class="text-xs text-gray-500"><strong>Disclaimer:</strong> This analysis is based on image recognition patterns and is not a medical diagnosis. Always consult a healthcare professional for proper medical advice.</p>
        `;
    } else {
        // Check for certain keywords to provide more specific responses
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('headache')) {
            response = `
                <p class="text-gray-700 mb-3">I understand you're experiencing headaches. Headaches can have various causes including tension, dehydration, or other factors.</p>
                <p class="font-semibold mb-2">Suggestions that might help:</p>
                <ul class="list-disc pl-5 mb-3 text-gray-700">
                    <li>Rest in a quiet, dark room</li>
                    <li>Apply a cold or warm compress to your forehead or neck</li>
                    <li>Stay hydrated by drinking water</li>
                    <li>Consider over-the-counter pain relief if appropriate for you</li>
                </ul>
                <p class="text-xs text-gray-500"><strong>Disclaimer:</strong> This is not medical advice. If your headache is severe, persistent, or accompanied by other symptoms like fever or vision changes, please seek medical attention immediately.</p>
            `;
        } else if (lowerInput.includes('fever') || lowerInput.includes('temperature')) {
            response = `
                <p class="text-gray-700 mb-3">I understand you're experiencing fever. Fever is often a sign that your body is fighting an infection.</p>
                <p class="font-semibold mb-2">Suggestions that might help:</p>
                <ul class="list-disc pl-5 mb-3 text-gray-700">
                    <li>Stay hydrated with water, broth, or electrolyte solutions</li>
                    <li>Rest as much as possible</li>
                    <li>Use over-the-counter fever reducers if appropriate for you</li>
                    <li>Use a cool compress on your forehead</li>
                </ul>
                <p class="text-xs text-gray-500"><strong>Disclaimer:</strong> This is not medical advice. If your fever is high (above 103°F/39.4°C), persists for more than 3 days, or is accompanied by severe symptoms, please seek medical attention.</p>
            `;
        } else if (lowerInput.includes('cough') || lowerInput.includes('cold')) {
            response = `
                <p class="text-gray-700 mb-3">I understand you're experiencing cough or cold symptoms. These are common respiratory issues that can be caused by viruses or allergies.</p>
                <p class="font-semibold mb-2">Suggestions that might help:</p>
                <ul class="list-disc pl-5 mb-3 text-gray-700">
                    <li>Get plenty of rest</li>
                    <li>Stay hydrated with warm liquids like tea or broth</li>
                    <li>Use a humidifier to add moisture to the air</li>
                    <li>Consider over-the-counter cough suppressants or expectorants if appropriate</li>
                </ul>
                <p class="text-xs text-gray-500"><strong>Disclaimer:</strong> This is not medical advice. If your symptoms are severe, persist for more than 10 days, or are accompanied by difficulty breathing, please seek medical attention.</p>
            `;
        } else {
            response = `
                <p class="text-gray-700 mb-3">Thank you for describing your symptoms. Based on what you've shared, here are some general suggestions that might help:</p>
                <ul class="list-disc pl-5 mb-3 text-gray-700">
                    <li>Rest and allow your body time to recover</li>
                    <li>Stay hydrated by drinking plenty of fluids</li>
                    <li>Monitor your symptoms for any changes</li>
                    <li>Consider keeping a symptom diary to track patterns</li>
                </ul>
                <p class="text-xs text-gray-500"><strong>Disclaimer:</strong> This is for informational purposes only and is not a substitute for professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.</p>
            `;
        }
    }
    
    addMessage(response, 'bot');
}

// Allow Enter key to submit text (but Shift+Enter for new line)
symptomText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitTextBtn.click();
    }
});