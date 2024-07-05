$(document).ready(function () {
    axios.defaults.withCredentials = true;

    fetchUserDataById();

    $('#upload-avatar').on('click', function () {
        $('#fileInput').click();
    });

    $('#fileInput').on('change', function () {
        uploadAvatar();
    });

    $('#edit-profile').on('click', function () {
        $('#account-form').removeClass('d-none');
        $('#account-table-body').addClass('d-none');
        $('#edit-profile').addClass('d-none');
    });

    $('#account-form').on('submit', function (event) {
        event.preventDefault();
        updateAccountData();
    });

    $('#delete-account').on('click', function () {
        deleteAccount();
    });

    $('#delete-avatar').on('click', function (event) {
        event.preventDefault();
        deleteAvatar();
    });
});

function fetchUserDataById() {
    
    axios.get('http://localhost:9090/api/users/1') // Replace '1' with actual user ID
        .then(function (response) {
            const user = response.data;
            console.log(user);
            $('#firstName').val(user.firstName);
            $('#lastName').val(user.lastName);
            $('#email').val(user.email);
            $('#phone').val(user.phone);
            $('#dob').val(user.dob);
            $('#address').val(user.address);

            $('#account-firstName').text(user.firstName);
            $('#account-lastName').text(user.lastName);
            $('#account-email').text(user.email);
            $('#account-phone').text(user.phone);
            $('#account-address').text(user.address);
            $('#account-dob').text(user.dob);
            if (user.imageURL) {
                $('#avatar-image').attr('src', user.imageURL);
            }
        })
        .catch(function (error) {
            console.error('Error fetching user data:', error);
        });
}

function uploadAvatar() {
    const formData = new FormData();
    formData.append('images', $('#fileInput')[0].files[0]);

    // Replace 'admin@example.com' with the actual admin email or retrieve it dynamically if necessary
    const adminEmail = 'aboodoma27@gmail.com';

    axios.post(`http://localhost:9090/api/user-images/${adminEmail}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(function (response) {
        if (response.data && response.data.length > 0) {
            const avatarImageUrl = "data:" + response.data[0].contentType + ";base64," + response.data[0].base64;
            $('#avatar-image').attr('src', avatarImageUrl);
            alert('Avatar uploaded successfully!');
        } else {
            alert('No image data received from the server.');
        }
    })
    .catch(function (error) {
        console.error('Error uploading avatar:', error);
        alert('Error uploading avatar.');
    });
}

function updateAccountData() {
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const address = $('#address').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirmPassword').val();
    const phone = $('#phone').val();

    // Validate password
    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain at least one symbol, one number, one uppercase letter, and one lowercase letter.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please re-enter matching passwords.');
        return;
    }

    const data = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        password: password,
        phone: phone
    };

    axios.put('http://localhost:9090/api/admins/1', data)
        .then(function (response) {
            // Display response data
            console.log('Update Response:', response.data); // Logging the response for debugging

            // Show success message
            alert('Account updated successfully!');

            // Refresh user data after update
            fetchUserDataById();

            // Hide the account form and show table body and edit profile button
            $('#account-form').addClass('d-none');
            $('#account-table-body').removeClass('d-none');
            $('#edit-profile').removeClass('d-none');
        })
        .catch(function (error) {
            console.error('Error updating account:', error);

            // Display error message to the user
            alert('Error updating account. Please try again later.');
        });
}

// Function to validate password
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function deleteAvatar() {
    axios.delete('URL_TO_YOUR_BACKEND_API/account/avatar')
        .then(function (response) {
            $('#avatar-image').attr('src', 'img/avatar.png');
            alert('Avatar deleted successfully!');
        })
        .catch(function (error) {
            console.error('Error deleting avatar:', error);
        });
}
