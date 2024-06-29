document.addEventListener('DOMContentLoaded', function() {
    const registrationButton = document.querySelector('button[type="button"]');
    const userNameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const ageInput = document.getElementById('ageInput');
    const genderInput = document.getElementById('genderInput');
    const birthdateInput = document.getElementById('birthdateInput');
    const profilePictureInput = document.getElementById('profilePictureInput');
    const messageDiv = document.getElementById('message');

    registrationButton.addEventListener('click', function(event) {
        event.preventDefault();
        messageDiv.style.display = 'none'; // Hide message initially

        const validations = [
            { check: userNameInput.value.trim() && passwordInput.value && confirmPasswordInput.value && emailInput.value &&
                      phoneInput.value && ageInput.value && genderInput.value && birthdateInput.value && profilePictureInput.files.length,
              message: 'Please fill out all required fields and upload a profile picture.' },
            { check: validateEmail(emailInput.value), message: 'Please enter a valid email address.' },
            { check: passwordInput.value === confirmPasswordInput.value, message: 'Passwords do not match.' },
            { check: validatePassword(passwordInput.value), message: 'Password must contain at least one uppercase letter, one symbol like @#.$ and be at least 8 characters long.' },
            { check: validatePhone(phoneInput.value), message: 'Invalid phone number.' },
            { check: validateAge(ageInput.value), message: 'Age must be a two-digit number.' },
            { check: validateBirthdate(birthdateInput.value), message: 'Birthdate must be before 2024.' },
            { check: validateProfilePicture(profilePictureInput.files[0]), message: 'Only image files are allowed.' }
        ];

        for (let validation of validations) {
            if (!validation.check) {
                showMessage(validation.message);
                return;
            }
        }

        // Prepare the data to be sent
        const formData = new FormData();
        formData.append('username', userNameInput.value);
        formData.append('password', passwordInput.value);
        formData.append('email', emailInput.value);
        formData.append('phone', phoneInput.value);
        formData.append('age', ageInput.value);
        formData.append('gender', genderInput.value);
        formData.append('birthdate', birthdateInput.value);
        formData.append('profilePicture', profilePictureInput.files[0]);

        // Fetch API call to register the user
        fetch('/api/register', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                alert('Registration successful! Your account has been created.');
                // Redirect to the homepage
                window.location.href = 'index.html';
            } else {
                showMessage(data.message || 'An error occurred during registration.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.');
        });
    });

    function showMessage(message) {
        messageDiv.textContent = message;
        messageDiv.style.display = 'block'; // Show message
    }

    function validateUserName(userName) {
        return /^[A-Za-z]+$/.test(userName);
    }

    function validatePassword(password) {
        const pattern = /^(?=.*[A-Z])(?=.*[@#.$]).{8,}$/;
        return pattern.test(password);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const phoneRe = /^[0-9]{10}$/;
        return phoneRe.test(phone);
    }

    function validateAge(age) {
        const ageRe = /^\d{2}$/;
        return ageRe.test(age);
    }

    function validateBirthdate(birthdate) {
        const birthdateObj = new Date(birthdate);
        const cutoffDate = new Date('2024-01-01');
        return birthdateObj < cutoffDate;
    }

    function validateProfilePicture(file) {
        if (!file) return false; // Check if a file was actually uploaded
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        return allowedExtensions.exec(file.name);
    }
});
