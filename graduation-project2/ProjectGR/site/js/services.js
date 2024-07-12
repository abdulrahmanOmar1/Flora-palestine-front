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

  // التحقق من تسجيل الدخول وعرض معلومات المستخدم
  if (Cookies.get('userId')) {
    sessionStorage.setItem('isLoggedIn', true);
    sessionStorage.setItem('userId', Cookies.get('userId'));
    sessionStorage.setItem('userEmail', Cookies.get('userEmail'));
    sessionStorage.setItem('role', Cookies.get('role'));

    console.log("User ID:", sessionStorage.getItem('userId'));
    console.log("User Email:", sessionStorage.getItem('userEmail'));

    const userMenu = document.querySelector('.user-menu');
    const loginLink = document.querySelector('.login-link');
    const userMenuButton = document.querySelector('.user-menu-button');
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('role');

    userMenu.style.display = 'inline-block';
    loginLink.style.display = 'none';

    axios.get(`http://localhost:9090/api/users/${userId}`)
      .then(response => {
        const user = response.data;
        const firstName = user.firstName;
        const lastName = user.lastName;
        userMenuButton.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`;
      })
      .catch(error => {
        console.log("Error:", error);
      });

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function() {
      sessionStorage.clear();
      Cookies.remove('userId');
      Cookies.remove('userEmail');
      Cookies.remove('role');
      window.location.replace('login.html');
    });
  } else {
    console.log("No user information found in cookies.");
    const userMenu = document.querySelector('.user-menu');
    userMenu.style.display = 'none';

    const loginLink = document.querySelector('.login-link');
    loginLink.style.display = 'inline-block';
  }
});
