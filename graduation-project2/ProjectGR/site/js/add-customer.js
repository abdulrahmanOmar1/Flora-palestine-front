document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addCustomerForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('emailInput').value;
            const firstName = document.getElementById('firstNameInput').value;
            const lastName = document.getElementById('lastNameInput').value;
            const password = document.getElementById('passwordInput').value;
            const phone = document.getElementById('phoneInput').value;
            const address = document.getElementById('addressInput').value;
            const birthdate = document.getElementById('birthdateInput').value;
            const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null;

            // Validation
            if (!email) {
                alert('Email is required.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (!firstName) {
                alert('First name is required.');
                return;
            }

            const nameRegex = /^[A-Za-z]+$/;
            if (!nameRegex.test(firstName)) {
                alert('First name must not contain any numbers or special characters.');
                return;
            }

            if (!lastName) {
                alert('Last name is required.');
                return;
            }

            if (!nameRegex.test(lastName)) {
                alert('Last name must not contain any numbers or special characters.');
                return;
            }

            if (!password) {
                alert('Password is required.');
                return;
            }

            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                alert('Password must be at least 8 characters long and contain at least one letter, one number, and one special character.');
                return;
            }

            if (!phone) {
                alert('Phone number is required.');
                return;
            }

            const phoneRegex = /^(056|059)\d{7}$/;
            if (!phoneRegex.test(phone)) {
                alert('Phone number must start with 056 or 059 and be 10 digits long.');
                return;
            }

            if (!address) {
                alert('Address is required.');
                return;
            }

            if (!birthdate) {
                alert('Birthdate is required.');
                return;
            }

            if (!gender) {
                alert('Gender is required.');
                return;
            }

            const data = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                phone: phone,
                address: address,
                dob: birthdate,
                gender: gender
            };

            console.log('Payload:', data); // Add logging to check the payload

            axios.post('http://localhost:9090/api/users', data)
                .then(function (response) {
                    alert('User added successfully!');
                    console.log(response.data);
                })
                .catch(function (error) {
                    if (error.response) {
                        if (error.response.status === 409) { // HTTP Status 409: Conflict
                            alert('Email is already registered.');
                        } else {
                            alert('An error occurred. Please try again.');
                        }
                    } else {
                        alert('An error occurred. Please try again.');
                    }
                    console.error(error);
                });
        });
    }
});
