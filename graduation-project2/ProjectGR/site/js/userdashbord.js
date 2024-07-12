document.addEventListener('DOMContentLoaded', function() {
    const usersTableBody = document.getElementById('usersTableBody');

    // Function to fetch users and populate the table
    function fetchUsers() {
        axios.get('http://localhost:9090/api/users')
            .then(response => {
                const users = response.data;
                console.log("users", users);
                usersTableBody.innerHTML = ''; // Clear the table body

                users.forEach(user => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td></td>
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.email}</td>
                        <td>${user.password}</td>
                        <td>${user.enabled ? 'Active' : 'Inactive'}</td>
                        <td><img src="${user.imageURL}" alt="User Image" class="img-fluid" width="50"></td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-btn" data-id="${user.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">Delete</button>
                        </td>
                    `;

                    usersTableBody.appendChild(row);
                });
            })
            .catch(error => {
                Swal.fire('Error', 'There was an error fetching the user data!', 'error');
                console.error('There was an error fetching the user data!', error);
            });
    }

    // Fetch users when the page loads
    fetchUsers();

    // Event delegation for edit and delete buttons
    usersTableBody.addEventListener('click', function(event) {
        const target = event.target;
        const userId = target.getAttribute('data-id');

        if (target.classList.contains('edit-btn')) {
            // Handle edit user
            editUser(userId);
        } else if (target.classList.contains('delete-btn')) {
            // Handle delete user
            deleteUser(userId);
        }
    });

    // Function to handle edit user
    function editUser(userId) {
        // Fetch user data and populate the edit modal
        axios.get(`http://localhost:9090/api/users/${userId}`)
            .then(response => {
                const user = response.data;
                document.getElementById('editUserId').value = user.id;
                document.getElementById('editUserFirstName').value = user.firstName;
                document.getElementById('editUserLastName').value = user.lastName;
                document.getElementById('editUserAddress').value = user.address;
                document.getElementById('editUserPhone').value = user.phone;
                document.getElementById('editUserDob').value = user.dob;
                document.getElementById('editUserGender').value = user.gender;
                document.getElementById('editUserRole').value = user.role;
                document.getElementById('editUserEnabled').value = user.enabled;
                // Show the edit modal
                $('#editUserModal').modal('show');
            })
            .catch(error => {
                Swal.fire('Error', 'There was an error fetching the user data for editing!', 'error');
                console.error('There was an error fetching the user data for editing!', error);
            });
    }

    // Function to handle delete user
    function deleteUser(userId) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this user?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:9090/api/users/${userId}`)
                    .then(response => {
                        Swal.fire('Deleted!', 'User deleted successfully!', 'success');
                        fetchUsers(); // Refresh the table
                    })
                    .catch(error => {
                        Swal.fire('Error', 'There was an error deleting the user!', 'error');
                        console.error('There was an error deleting the user!', error);
                    });
            }
        });
    }

    // Handle form submission for edit user
    const editUserForm = document.getElementById('editUserForm');
    editUserForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const userId = document.getElementById('editUserId').value;
        const firstName = document.getElementById('editUserFirstName').value;
        const lastName = document.getElementById('editUserLastName').value;
        const address = document.getElementById('editUserAddress').value;
        const phone = document.getElementById('editUserPhone').value;
        const dob = document.getElementById('editUserDob').value;
        const gender = document.getElementById('editUserGender').value;
        const role = document.getElementById('editUserRole').value;
        const enabled = document.getElementById('editUserEnabled').value === 'true';

        // Validation
        const nameRegex = /^[A-Za-z]+$/;
        const phoneRegex = /^(056|059)\d{7}$/;

        if (!firstName) {
            Swal.fire('Validation Error', 'First name is required.', 'error');
            return;
        }
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

        if (!phone) {
            Swal.fire('Validation Error', 'Phone number is required.', 'error');
            return;
        }
        if (!phoneRegex.test(phone)) {
            Swal.fire('Validation Error', 'Phone number must start with 056 or 059 and be 10 digits long.', 'error');
            return;
        }

        if (!address) {
            Swal.fire('Validation Error', 'Address is required.', 'error');
            return;
        }

        if (!dob) {
            Swal.fire('Validation Error', 'Birthdate is required.', 'error');
            return;
        }

        if (!gender) {
            Swal.fire('Validation Error', 'Gender is required.', 'error');
            return;
        }

        const updatedUser = {
            firstName,
            lastName,
            address,
            phone,
            dob,
            gender,
            role,
            enabled
        };

        axios.put(`http://localhost:9090/api/users/update/${userId}`, updatedUser)
            .then(response => {
                Swal.fire('Success', 'User updated successfully!', 'success');
                $('#editUserModal').modal('hide');
                fetchUsers(); // Refresh the table
            })
            .catch(error => {
                Swal.fire('Error', 'There was an error updating the user!', 'error');
                console.error('There was an error updating the user!', error);
            });
    });
});
