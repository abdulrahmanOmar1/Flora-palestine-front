// Login.js

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('button[type="button"]');
    const emailInput = document.getElementById('form3Example3');
    const passwordInput = document.getElementById('form3Example4');

    const correctEmail = 'Odaykhallaf51@gmail.com'; 
    const correctPassword = '12345'; 

    loginButton.addEventListener('click', function() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please enter both an email and a password.');
            return;
        }

        if (email === correctEmail && password === correctPassword) {
            console.log('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });
});





document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('button[type="button"]');
    const emailInput = document.getElementById('form3Example3');
    const passwordInput = document.getElementById('form3Example4');

    loginButton.addEventListener('click', function() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('Please enter both an email and a password.');
            return;
        }

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Login successful!');
                window.location.replace('index.html'); 
            } else {
                alert('Invalid email or password. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});
