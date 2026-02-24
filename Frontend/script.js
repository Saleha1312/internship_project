document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // Function to append a message to the chat
    function appendMessage(sender, message, isTypingIndicator = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        if (isTypingIndicator) {
            messageElement.classList.add('typing-indicator');
        }

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');

        if (isTypingIndicator) {
            messageBubble.innerHTML = `<span></span><span></span><span></span>`;
        } else {
            messageBubble.textContent = message;
        }

        messageElement.appendChild(messageBubble);
        chatMessages.appendChild(messageElement);

        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageElement; // Return the element to remove it later
    }

    let typingIndicatorElement = null;

    function showTypingIndicator() {
        if (!typingIndicatorElement) {
            typingIndicatorElement = appendMessage('gemini', '', true);
        }
    }

    function removeTypingIndicator() {
        if (typingIndicatorElement) {
            typingIndicatorElement.remove();
            typingIndicatorElement = null;
        }
    }

    // Event listener for sending messages
    sendButton.addEventListener('click', async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            appendMessage('user', userMessage);
            chatInput.value = ''; // Clear input

            showTypingIndicator(); // Show typing indicator
            
            try {
                const response = await fetch(`http://localhost:8080/chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: userMessage }) // Use userMessage as the query
                });

                const data = await response.json();

                removeTypingIndicator(); // Remove typing indicator

                if (data.answer) {
                    appendMessage("gemini", data.answer); // Directly append for now, can be replaced with typeWriterEffect
                } else {
                    appendMessage("gemini", "Error: " + JSON.stringify(data));
                }

            } catch (error) {
                removeTypingIndicator();
                appendMessage("gemini", "⚠ Server error. Is backend running? Error: " + error.message);
            }
        }
    });

    // Event listener for pressing Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // Initial welcome message from Purple Elephant
    appendMessage('gemini', 'Hello! I am ADBot here to help. How can I assist you today?');
});