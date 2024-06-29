document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-btn');
    const wordInput = document.getElementById('word-input');
    const replyContent = document.getElementById('reply-content');

    const sendMessage = () => {
        const message = wordInput.value.trim();
        if (message) {
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('user-message');
            userMessageDiv.textContent = message;
            replyContent.appendChild(userMessageDiv);

            axios.post('https://example.com/api/sendMessage', {
                message: message
            })
            .then(response => {
                const botReply = response.data.reply;
                const botMessageDiv = document.createElement('div');
                botMessageDiv.classList.add('bot-message');
                botMessageDiv.textContent = botReply;
                replyContent.appendChild(botMessageDiv);
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });

            wordInput.value = '';
        }
    };

    submitBtn.addEventListener('click', sendMessage);
    wordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
