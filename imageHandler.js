
const GEMINI_CONFIG = {
    apiKey: 'AIzaSyD30mJcEIQTO2vAJ2i6BjwR8qoibvmuvLg', 
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
};

// Handle Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            addMessage('ai', 'Please upload a valid image file (JPEG, PNG, or WebP).');
            return;
        }

        // Validate file size (max 4MB)
        if (file.size > 4 * 1024 * 1024) {
            addMessage('ai', 'Image file is too large. Please upload an image smaller than 4MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
            
            // Add image message to chat
            addMessage('user', `[Image uploaded: ${file.name}]`, true);
            
            // Show typing indicator
            showTypingIndicator();
            
            // Analyze image with Gemini API
            analyzeImageWithGemini(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    }
}

// Convert image to base64 for Gemini API
function convertImageToBase64(dataUrl) {
    return dataUrl.split(',')[1];
}

// Get MIME type from data URL
function getMimeType(dataUrl) {
    const matches = dataUrl.match(/data:([^;]+);/);
    return matches ? matches[1] : 'image/jpeg';
}

// Analyze Image with Google Gemini API
async function analyzeImageWithGemini(imageDataUrl, fileName) {
    try {
        // Check if API key is configured
        if (!GEMINI_CONFIG.apiKey) {
            console.error('Gemini API key not configured');
            hideTypingIndicator();
            addMessage('ai', 'Image analysis service is not configured. Please check the API key.');
            return;
        }

        const base64Image = convertImageToBase64(imageDataUrl);
        const mimeType = getMimeType(imageDataUrl);

        const requestBody = {
            contents: [{
                parts: [
                    {
                        text: `You are a medical AI assistant. Analyze this medical image (prescription, report, or medical document) and provide helpful information. 

                        Guidelines:
                        1. If it's a prescription: Identify medications, dosages, and provide general guidance
                        2. If it's a medical report: Explain the results in simple terms
                        3. If it's not medical: Politely indicate this
                        4. Always recommend consulting healthcare professionals
                        5. Use clear, simple language suitable for rural patients
                        6. Be empathetic and supportive
                        7. If you see any concerning values or medications, mention it
                        
                        Please analyze this image and provide helpful medical guidance:`
                    },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 1000,
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

        const response = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${GEMINI_CONFIG.apiKey}`, {
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
        
        hideTypingIndicator();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessage('ai', aiResponse);
        } else {
            throw new Error('Invalid response format from Gemini API');
        }

    } catch (error) {
        console.error('Error analyzing image with Gemini:', error);
        hideTypingIndicator();
        
        // Fallback to simulated responses
        addMessage('ai', 'I encountered an issue analyzing your image. Here\'s some general guidance: Please consult with a healthcare professional for proper interpretation of medical documents. If this is a prescription, verify all details with your pharmacist.');
    }
}

// Fallback function for when API is not available
function analyzeImageFallback(fileName) {
    const responses = [
        "I can see this appears to be a medical document. For accurate interpretation, please consult with a healthcare professional who can properly review the details.",
        "This looks like a prescription or medical report. I recommend discussing this with your doctor or pharmacist for proper guidance and interpretation.",
        "I can see medical text in this image. For your safety and accurate understanding, please have a qualified medical professional review this document.",
        "This appears to be a medical document. While I can see it contains important information, I recommend confirming all details with your healthcare provider."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage('ai', randomResponse);
}

// Error handling for network issues
function handleImageAnalysisError(error, fileName) {
    console.error('Image analysis error:', error);
    
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        addMessage('ai', 'Unable to connect to the analysis service. Please check your internet connection and try again.');
    } else if (error.message.includes('API key')) {
        addMessage('ai', 'Image analysis service is temporarily unavailable. Please try again later.');
    } else {
        addMessage('ai', 'There was an issue analyzing your image. Please ensure it\'s a clear medical document and try uploading again.');
    }
}