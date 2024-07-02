$(document).ready(function () {
    axios.defaults.withCredentials = true;

    fetchAccountData();

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

function fetchAccountData() {
    axios.get('URL_TO_YOUR_BACKEND_API/account')
        .then(function (response) {
            const account = response.data;
            $('#account-name').text(account.name);
            $('#account-email').text(account.email);
            $('#account-phone').text(account.phone);
            $('#name').val(account.name);
            $('#email').val(account.email);
            $('#phone').val(account.phone);
            if (account.avatar) {
                $('#avatar-image').attr('src', account.avatar);
            }
        })
        .catch(function (error) {
            console.error('Error fetching account data:', error);
        });
}

function uploadAvatar() {
    const formData = new FormData();
    formData.append('avatar', $('#fileInput')[0].files[0]);

    axios.post('URL_TO_YOUR_BACKEND_API/account/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(function (response) {
        $('#avatar-image').attr('src', response.data.avatar);
        alert('Avatar uploaded successfully!');
    })
    .catch(function (error) {
        console.error('Error uploading avatar:', error);
    });
}

function updateAccountData() {
    const data = {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        phone: $('#phone').val()
    };

    axios.put('URL_TO_YOUR_BACKEND_API/account', data)
        .then(function (response) {
            alert('Account updated successfully!');
            fetchAccountData();
            $('#account-form').addClass('d-none');
            $('#account-table-body').removeClass('d-none');
            $('#edit-profile').removeClass('d-none');
        })
        .catch(function (error) {
            console.error('Error updating account:', error);
        });
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
        axios.delete('URL_TO_YOUR_BACKEND_API/account')
            .then(function (response) {
                alert('Account deleted successfully!');
                window.location.href = 'login.html';
            })
            .catch(function (error) {
                console.error('Error deleting account:', error);
            });
    }
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
