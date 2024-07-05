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

        axios.post('http://localhost:9090/api/index/login', {
            email: email,
            password: password
        })
        .then(response => {
            console.log(response.data);
            console.log('Login successful!');
            
            // Save user ID and email in cookies
            Cookies.set('userId', response.data.id, { expires: 7 });
            Cookies.set('userEmail', response.data.email, { expires: 7 });
            Cookies.set('role', response.data.role, { expires: 7 });
            
            // Redirect to index.html or another page
            window.location.replace('index.html');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});
