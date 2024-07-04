document.addEventListener('DOMContentLoaded', function() {
    const registrationButton = document.querySelector('button[type="button"]');
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const addressInput = document.getElementById('addressInput');
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const birthdateInput = document.getElementById('birthdateInput');
    const messageDiv = document.getElementById('message');

    registrationButton.addEventListener('click', function(event) {
        event.preventDefault();

        const genderInput = document.querySelector('input[name="gender"]:checked'); // Move inside the event listener

        if (!genderInput) {
            showMessage('Please select your gender.');
            return;
        }

        console.log("Gender =", genderInput.value);
        console.log("Email =", emailInput.value);
        messageDiv.style.display = 'none';

        const validations = [
            { check: passwordInput.value && confirmPasswordInput.value && firstNameInput.value && lastNameInput.value && emailInput.value && addressInput.value &&
                      phoneInput.value && genderInput.value && birthdateInput.value,
              message: 'Please fill out all required fields.' },
            { check: validateEmail(emailInput.value), message: 'Please enter a valid email address.' },
            { check: passwordInput.value === confirmPasswordInput.value, message: 'Passwords do not match.' },
            { check: validatePassword(passwordInput.value), message: 'Password must contain at least one uppercase letter, one symbol like @#.$ and be at least 8 characters long.' },
            { check: validatePhone(phoneInput.value), message: 'Invalid phone number.' },
            { check: validateBirthdate(birthdateInput.value), message: 'Birthdate must be before 2024.' },
        ];

        for (let validation of validations) {
            if (!validation.check) {
                showMessage(validation.message);
                return;
            }
        }

        axios.post('http://localhost:9090/api/index/registration', {
            email: emailInput.value,
            password: passwordInput.value,
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            address: addressInput.value,
            phone: phoneInput.value,
            role : 'ADMIN',
            dob: birthdateInput.value,
            gender: genderInput.value,
        }).then(response => {
            window.location.href = 'http://http://127.0.0.1:5500/Flora-palestine-front/graduation-project2/ProjectGR/site/Login.html';
        }).catch(error => {
            console.log("Error:", error);
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
