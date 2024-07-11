document.addEventListener("DOMContentLoaded", function() {
    const userId = sessionStorage.getItem('userId');
    const userEmail = sessionStorage.getItem('userEmail');

    function showAlert(message) {
        Swal.fire({
            icon: 'warning',
            title: 'Alert',
            text: message,
        });
    }

    if (userId) {
        axios.get(`http://localhost:9090/api/users/${userId}`)
            .then(response => {
                const user = response.data;
                document.getElementById('firstName').value = user.firstName;
                document.getElementById('lastName').value = user.lastName;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userAddress').value = user.address;
                document.getElementById('userPhone').value = user.phone;
                document.getElementById('userGender').value = user.gender;
                document.getElementById('userDob').value = user.dob;
                document.getElementById('userPassword').value = user.password;
                
                // Fill edit form with current user data
                document.getElementById('editFirstName').value = user.firstName;
                document.getElementById('editLastName').value = user.lastName;
                document.getElementById('editPhone').value = user.phone;
                document.getElementById('editAddress').value = user.address;
                document.getElementById('editPassword').value = user.password;
                document.getElementById('avatar-image').src = user.imageURL || 'path/to/default/image.jpg';
            })
            .catch(error => {
                console.log("Error:", error);
            });

        document.getElementById('saveChangesButton').addEventListener('click', function() {
            const firstName = document.getElementById('editFirstName').value.trim();
            const lastName = document.getElementById('editLastName').value.trim();
            const phone = document.getElementById('editPhone').value.trim();
            const address = document.getElementById('editAddress').value.trim();
            const password = document.getElementById('editPassword').value.trim();
            const profileImage = document.getElementById('editProfileImage').files[0];

            const updatedUser = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                address: address,
                password: password
            };

            if (profileImage) {
                const formData = new FormData();
                formData.append('images', profileImage);

                axios.post(`http://localhost:9090/api/user-images/${userEmail}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    document.getElementById('avatar-image').src = response.data.imageURL || 'path/to/default/image.jpg';
                })
                .catch(error => {
                    console.log("Error updating profile image:", error);
                });
            }

            if (!firstName || !lastName || !phone || !address || !password) {
                showAlert('All fields are required.');
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                showAlert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
                return;
            }

            axios.put(`http://localhost:9090/api/users/${userId}`, updatedUser)
                .then(response => {
                    // Update the displayed user information
                    document.getElementById('firstName').value = response.data.firstName;
                    document.getElementById('lastName').value = response.data.lastName;
                    document.getElementById('userPhone').value = response.data.phone;
                    document.getElementById('userAddress').value = response.data.address;
                    document.getElementById('userPassword').value = response.data.password;

                    // Update edit form fields
                    document.getElementById('editFirstName').value = response.data.firstName;
                    document.getElementById('editLastName').value = response.data.lastName;
                    document.getElementById('editPhone').value = response.data.phone;
                    document.getElementById('editAddress').value = response.data.address;
                    document.getElementById('editPassword').value = response.data.password;

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User information updated successfully'
                    }).then(() => {
                        // Hide the modal after showing the success message
                        var editModal = new bootstrap.Modal(document.getElementById('editModal'));
                        editModal.hide();
                    });
                })
                .catch(error => {
                    console.log("Error updating user information:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'There was an error updating your information. Please try again.',
                    }).then(() => {
                        // Hide the modal even if there's an error
                        var editModal = new bootstrap.Modal(document.getElementById('editModal'));
                        editModal.hide();
                    });
                });
        });
    } else {
        showAlert("No user information found.");
        window.location.href = "login.html";
    }
});
