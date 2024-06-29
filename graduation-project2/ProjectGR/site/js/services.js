document.addEventListener('DOMContentLoaded', function() {
    window.onload = function() {
      document.querySelector('.preloader').style.display = 'none';
    };
  
    const newsletterSubmitButton = document.querySelector('.newsletter-form button[type="submit"]');
    if (newsletterSubmitButton) {
      newsletterSubmitButton.addEventListener('click', function(event) {
        event.preventDefault();
        const emailInput = document.querySelector('.newsletter-form input[type="text"]');
        const email = emailInput.value;
        const messageDiv = document.querySelector('.newsletter-message');
  
        if (email) {
          axios.post('/subscribe', { email: email })
            .then(function(response) {
              if (response.data.success) {
                messageDiv.style.display = 'block';
                messageDiv.style.color = 'green';
                messageDiv.textContent = 'Thank you for subscribing!';
              } else {
                messageDiv.style.display = 'block';
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'There was an error. Please try again.';
              }
            })
            .catch(function(error) {
              messageDiv.style.display = 'block';
              messageDiv.style.color = 'red';
              messageDiv.textContent = 'There was an error. Please try again.';
              console.error('Error:', error);
            });
        } else {
          messageDiv.style.display = 'block';
          messageDiv.style.color = 'red';
          messageDiv.textContent = 'Please enter a valid email address.';
        }
      });
    }
  
    const submitBtn = document.getElementById('submit-btn');
    const wordInput = document.getElementById('word-input');
    const replyContent = document.getElementById('reply-content');
  
    function sendMessage() {
      const userMessage = wordInput.value;
      if (userMessage) {
        const userMessageElement = document.createElement('div');
        userMessageElement.textContent = 'You: ' + userMessage;
        userMessageElement.style.color = 'blue';
        replyContent.appendChild(userMessageElement);
        
        axios.post('/chat', { message: userMessage })
          .then(function(response) {
            if (response.data.reply) {
              const botReplyElement = document.createElement('div');
              botReplyElement.textContent = 'FloraPalestine: ' + response.data.reply;
              botReplyElement.style.color = 'green';
              replyContent.appendChild(botReplyElement);
            } else {
              const errorElement = document.createElement('div');
              errorElement.textContent = 'There was an error. Please try again.';
              errorElement.style.color = 'red';
              replyContent.appendChild(errorElement);
            }
          })
          .catch(function(error) {
            const errorElement = document.createElement('div');
            errorElement.textContent = 'There was an error. Please try again.';
            errorElement.style.color = 'red';
            replyContent.appendChild(errorElement);
            console.error('Error:', error);
          });
  
        wordInput.value = '';
      } else {
        alert('Please enter a message.');
      }
    }
  
    if (submitBtn && wordInput && replyContent) {
      submitBtn.addEventListener('click', sendMessage);
  
      wordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          sendMessage();
        }
      });
    }
  });
  