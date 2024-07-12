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
                Swal.fire('Validation Error', 'Email is required.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Swal.fire('Validation Error', 'Please enter a valid email address.', 'error');
                return;
            }

            if (!firstName) {
                Swal.fire('Validation Error', 'First name is required.', 'error');
                return;
            }

            const nameRegex = /^[A-Za-z]+$/;
            if (!nameRegex.test(firstName)) {
                Swal.fire('Validation Error', 'First name must not contain any numbers or special characters.', 'error');
                return;
            }

            if (!lastName) {
                Swal.fire('Validation Error', 'Last name is required.', 'error');
                return;
            }

            if (!nameRegex.test(lastName)) {
                Swal.fire('Validation Error', 'Last name must not contain any numbers or special characters.', 'error');
                return;
            }

            if (!password) {
                Swal.fire('Validation Error', 'Password is required.', 'error');
                return;
            }

            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                Swal.fire('Validation Error', 'Password must be at least 8 characters long and contain at least one letter, one number, and one special character.', 'error');
                return;
            }

            if (!phone) {
                Swal.fire('Validation Error', 'Phone number is required.', 'error');
                return;
            }

            const phoneRegex = /^(056|059)\d{7}$/;
            if (!phoneRegex.test(phone)) {
                Swal.fire('Validation Error', 'Phone number must start with 056 or 059 and be 10 digits long.', 'error');
                return;
            }

            if (!address) {
                Swal.fire('Validation Error', 'Address is required.', 'error');
                return;
            }

            if (!birthdate) {
                Swal.fire('Validation Error', 'Birthdate is required.', 'error');
                return;
            }

            if (!gender) {
                Swal.fire('Validation Error', 'Gender is required.', 'error');
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
                    Swal.fire('Success', 'User added successfully!', 'success');
                    console.log(response.data);
                })
                .catch(function (error) {
                    if (error.response) {
                        if (error.response.status === 409) { // HTTP Status 409: Conflict
                            Swal.fire('Error', 'Email is already registered.', 'error');
                        } else {
                            Swal.fire('Error', 'An error occurred. Please try again.', 'error');
                        }
                    } else {
                        Swal.fire('Error', 'An error occurred. Please try again.', 'error');
                    }
                    console.error(error);
                });
        });
    }
});
