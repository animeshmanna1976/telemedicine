// Chatbot State Management
let currentInputMode = 'text';
let chatbotOpen = false;

// Toggle Chatbot
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot-window');
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbot.classList.add('active');
        document.getElementById('chat-input').focus();
    } else {
        chatbot.classList.remove('active');
    }
}

// Set Input Mode
function setInputMode(mode) {
    currentInputMode = mode;
    
    // Update button states
    document.querySelectorAll('.input-option-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide relevant input areas
    const imageArea = document.getElementById('image-upload-area');
    const voiceArea = document.getElementById('voice-recording');
    const textInput = document.getElementById('chat-input');
    
    imageArea.classList.remove('active');
    voiceArea.classList.remove('active');
    
    switch(mode) {
        case 'text':
            textInput.style.display = 'block';
            textInput.placeholder = 'Describe your symptoms or ask a question...';
            textInput.focus();
            break;
        case 'image':
            textInput.style.display = 'block';
            textInput.placeholder = 'Upload prescription or medical image below...';
            imageArea.classList.add('active');
            break;
        case 'voice':
            textInput.style.display = 'block';
            textInput.placeholder = 'Click the voice button to start recording...';
            startRecording();
            break;
    }
}

// Handle Key Press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send Message - Updated to handle async AI responses
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        addMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Wait for AI response (now properly handling the Promise)
            const response = await getAIResponse(message);
            hideTypingIndicator();
            addMessage('ai', response);
        } catch (error) {
            console.error('Error getting AI response:', error);
            hideTypingIndicator();
            addMessage('ai', 'I apologize, but I\'m having trouble responding right now. Please try again or consult with a healthcare professional.');
        }
    } else if (currentInputMode === 'voice') {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }
}

// Add Message to Chat
function addMessage(sender, message, isImage = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? 'U' : 'AI';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    if (isImage) {
        bubble.innerHTML = `<i class="fas fa-image"></i> ${message}`;
    } else {
        // Handle HTML content properly and convert line breaks
        bubble.innerHTML = message.replace(/\n/g, '<br>');
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show/Hide Typing Indicator
function showTypingIndicator() {
    document.getElementById('typing-indicator').classList.add('active');
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').classList.remove('active');
}

// Enhanced message handling for emergency detection
async function handleEmergencyMessage(message) {
    if (isEmergencyMessage(message)) {
        // Add immediate emergency response
        addMessage('ai', '🚨 EMERGENCY DETECTED: If this is a medical emergency, please call 102 immediately or go to the nearest hospital. Do not wait for online advice.');
        
        // Then get detailed AI response
        showTypingIndicator();
        try {
            const response = await getAIResponse(message);
            hideTypingIndicator();
            addMessage('ai', response);
        } catch (error) {
            hideTypingIndicator();
            addMessage('ai', 'For emergency situations, please contact emergency services immediately: 102 (Medical), 112 (General Emergency)');
        }
        return true;
    }
    return false;
}

// Update sendMessage to handle emergencies
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        addMessage('user', message);
        input.value = '';
        
        // Check for emergency first
        const isEmergency = await handleEmergencyMessage(message);
        
        if (!isEmergency) {
            // Show typing indicator for non-emergency messages
            showTypingIndicator();
            
            try {
                // Wait for AI response
                const response = await getAIResponse(message);
                hideTypingIndicator();
                addMessage('ai', response);
            } catch (error) {
                console.error('Error getting AI response:', error);
                hideTypingIndicator();
                
                // Fallback to local response
                const fallbackResponse = getFallbackResponse(message);
                addMessage('ai', fallbackResponse);
            }
        }
    } else if (currentInputMode === 'voice') {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }
}