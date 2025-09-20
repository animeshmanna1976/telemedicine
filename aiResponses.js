const GEMINI_TEXT_CONFIG = {
    apiKey: 'AIzaSyD30mJcEIQTO2vAJ2i6BjwR8qoibvmuvLg',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
};

async function getAIResponse(message) {
    try {
        // Check if API key is configured
        if (!GEMINI_TEXT_CONFIG.apiKey) {
            console.error('Gemini API key not configured');
            return getFallbackResponse(message);
        }

        const response = await getGeminiTextResponse(message);
        return response;
        
    } catch (error) {
        console.error('Error getting Gemini response:', error);
        return getFallbackResponse(message);
    }
}

// Get response from Google Gemini API
async function getGeminiTextResponse(userMessage) {
    try {
        const requestBody = {
            contents: [{
                parts: [{
                    text: createMedicalPrompt(userMessage)
                }]
            }],
            generationConfig: {
                temperature: 0.3,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 800,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(`${GEMINI_TEXT_CONFIG.apiUrl}?key=${GEMINI_TEXT_CONFIG.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            return aiResponse;
        } else {
            throw new Error('Invalid response format from Gemini API');
        }

    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}

// Create specialized medical prompt for Gemini
function createMedicalPrompt(userMessage) {
    return `You are a helpful medical AI assistant for Elixir 24/7, a rural healthcare platform serving villages around Nabha, Punjab, India. 

Your role:
- Provide helpful, accurate, and empathetic medical guidance
- Use simple, clear language suitable for rural patients
- Always emphasize consulting healthcare professionals for serious concerns
- Be culturally sensitive to Indian rural healthcare context
- Recognize emergency situations and advise immediate medical attention

Guidelines:
1. For symptoms: Provide general guidance, home remedies when appropriate, and clear advice on when to seek professional help
2. For emergencies: Immediately direct to emergency services (dial 102 for medical emergency in India)
3. For medications: Always recommend consulting pharmacist/doctor, never give specific dosage advice
4. For serious conditions: Strongly recommend professional medical consultation
5. Be supportive and understanding of rural healthcare access challenges
6. Include relevant Indian context (local emergency numbers, common practices)
7. Don't use asterisks in the output; use bold for key points.

User's message: "${userMessage}"

Please provide a helpful, empathetic response:`;
}

// Enhanced fallback responses with Indian context
function getFallbackResponse(message) {
    message = message.toLowerCase();
    
    // Emergency keywords
    if (message.includes('emergency') || message.includes('urgent') || message.includes('serious')) {
        return "🚨 For medical emergencies in India:\n• National Emergency: 112\n• Medical Emergency: 102\n• Police: 100\n• Fire: 101\n\nIf you're experiencing severe symptoms, please call 102 or visit the nearest hospital immediately.";
    }
    
    // Fever and temperature
    if (message.includes('fever') || message.includes('temperature') || message.includes('bukhar')) {
        return "बुखार (Fever) can indicate infection or other conditions. Please:\n• Monitor your temperature regularly\n• Stay hydrated with ORS or nimbu paani\n• Take rest\n• If fever is above 100.4°F (38°C) for more than 2 days, please consult a doctor\n• For children or elderly, seek medical help sooner.";
    }
    
    // Chest pain
    if (message.includes('chest pain') || message.includes('heart') || message.includes('chest')) {
        return "⚠️ Chest pain can be serious. If you have:\n• Severe chest pain\n• Difficulty breathing\n• Pain spreading to arm, jaw, or back\n• Sweating with chest pain\n\nPlease call 102 immediately or go to the nearest hospital. Don't ignore chest pain - it could be a heart problem.";
    }
    
    // Headache
    if (message.includes('headache') || message.includes('head pain') || message.includes('sir dard')) {
        return "सिर दर्द (Headache) can have many causes. Try:\n• Rest in a quiet, dark room\n• Drink plenty of water\n• Apply cold compress on forehead\n• Gentle head massage\n\nSee a doctor if headache is:\n• Very severe\n• With fever and neck stiffness\n• With vision problems\n• Lasting more than 3 days";
    }
    
    // Stomach issues
    if (message.includes('stomach') || message.includes('abdomen') || message.includes('belly') || message.includes('pet')) {
        return "पेट दर्द (Stomach pain) can have various causes:\n• Drink plenty of fluids\n• Eat light, simple food (khichdi, dal-chawal)\n• Avoid spicy, oily food\n• Try ginger tea for nausea\n\nConsult a doctor immediately if you have:\n• Severe pain\n• Vomiting blood\n• High fever\n• Pain lasting more than 24 hours";
    }
    
    // Cough and cold
    if (message.includes('cough') || message.includes('cold') || message.includes('khansi')) {
        return "खांसी (Cough) and cold management:\n• Drink warm water with honey and lemon\n• Steam inhalation 2-3 times daily\n• Ginger-tulsi tea\n• Rest and avoid cold foods\n• Turmeric milk before bed\n\nSee a doctor if:\n• Cough with blood\n• High fever\n• Difficulty breathing\n• Symptoms worsen after a week";
    }
    
    // COVID-19
    if (message.includes('covid') || message.includes('coronavirus') || message.includes('corona')) {
        return "COVID-19 symptoms (fever, cough, loss of taste/smell, breathing difficulty):\n• Isolate yourself immediately\n• Get tested at nearest testing center\n• Monitor oxygen levels if possible\n• Follow government guidelines\n• Call COVID helpline: 1075\n• Download Aarogya Setu app for updates";
    }
    
    // Diabetes
    if (message.includes('diabetes') || message.includes('blood sugar') || message.includes('madhumeh')) {
        return "मधुमेह (Diabetes) management:\n• Check blood sugar regularly\n• Take medicines as prescribed\n• Eat regular, balanced meals\n• Include walking/exercise daily\n• Avoid sugary foods and drinks\n• Regular doctor check-ups\n\nIf sugar is very high/low, contact your doctor immediately.";
    }
    
    // Blood pressure
    if (message.includes('blood pressure') || message.includes('hypertension') || message.includes('bp')) {
        return "रक्तचाप (Blood Pressure) management:\n• Take medicines regularly as prescribed\n• Reduce salt in food\n• Daily walk for 30 minutes\n• Avoid stress, practice yoga/meditation\n• Regular BP monitoring\n• Limit tea/coffee\n\nHigh BP can be silent - regular check-ups are important.";
    }
    
    // Pregnancy related
    if (message.includes('pregnancy') || message.includes('pregnant') || message.includes('garbhavti')) {
        return "गर्भावस्था (Pregnancy) care:\n• Regular antenatal check-ups\n• Take iron and folic acid tablets\n• Eat nutritious food\n• Avoid alcohol and smoking\n• Get vaccinations as advised\n• Register at nearest Anganwadi\n\nFor any concerns, visit ANM or doctor immediately.";
    }
    
    // Prescription/medicine
    if (message.includes('prescription') || message.includes('medicine') || message.includes('medication') || message.includes('dawa')) {
        return "दवा (Medicine) guidance:\n• Always consult pharmacist for doubts\n• Take medicines exactly as prescribed\n• Complete the full course\n• Check expiry dates\n• Store medicines properly\n• Never share prescription medicines\n\nFor questions about your medicines, contact your doctor or pharmacist.";
    }
    
    // Default responses with Indian context
    const defaultResponses = [
        "मैं आपकी चिंता समझ सकता हूं। सटीक जांच और इलाज के लिए किसी योग्य डॉक्टर से मिलना जरूरी है। निकटतम स्वास्थ्य केंद्र या PHC में संपर्क करें।",
        "आपके स्वास्थ्य की समस्या के लिए किसी अनुभवी डॉक्टर से सलाह लेना बेहतर होगा। वे आपकी स्थिति को ठीक से समझकर सही इलाज बता सकेंगे।",
        "I understand your health concern. For proper diagnosis and treatment, please consult with a qualified doctor at your nearest Primary Health Centre (PHC) or Community Health Centre (CHC).",
        "Your health is important. While I can provide general information, a healthcare professional can give you specific advice based on your individual condition. Please visit the nearest government hospital or clinic."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Check if user message indicates emergency
function isEmergencyMessage(message) {
    const emergencyKeywords = [
        'emergency', 'urgent', 'serious', 'severe pain', 'can\'t breathe', 
        'unconscious', 'bleeding', 'accident', 'heart attack', 'stroke',
        'chest pain', 'difficulty breathing', 'choking', 'poisoning'
    ];
    
    message = message.toLowerCase();
    return emergencyKeywords.some(keyword => message.includes(keyword));
}

// Get culturally appropriate greeting
function getGreeting() {
    const greetings = [
        "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। आप अपनी स्वास्थ्य संबंधी समस्या बता सकते हैं।",
        "Sat Sri Akal! I'm your AI health assistant. How can I help you with your health concerns today?",
        "Welcome to Elixir 24/7! I'm here to help you with health guidance. What would you like to know?",
        "नमस्कार! मैं आपकी स्वास्थ्य संबंधी मदद के लिए यहां हूं। कृपया अपनी समस्या बताएं।"
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAIResponse,
        getFallbackResponse,
        isEmergencyMessage,
        getGreeting
    };
}