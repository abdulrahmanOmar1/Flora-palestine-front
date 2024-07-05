document.addEventListener('DOMContentLoaded', function() {

    const userId = Cookies.get('userId');
    const userEmail = Cookies.get('userEmail');
    const userRole = Cookies.get('role');

    if (!userId || !userEmail || !userRole) {
        alert('You must be logged in to access this page.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    fetchFamilies();

    document.getElementById('addFamilyBtn').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'block';
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        searchFamily();
    });
});

function fetchFamilies() {
    axios.get('http://localhost:9090/api/families')
        .then(response => {
            const families = response.data;
            console.log(families); 
            populateFamiliesTable(families);
        })
        .catch(error => console.error('Error fetching families:', error));
}

function populateFamiliesTable(families) {
    const tbody = document.getElementById('familyTableBody');
    tbody.innerHTML = ''; 

    families.forEach((family, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td id="family-${index}">${family.name}</td>
            <td><button class="btn red" onclick="deleteFamily('${family.name}', this)">Delete</button></td>
            <td><button class="btn green update-btn" data-id="${index}" onclick="openUpdateModal('${family.name}')">Update</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteFamily(name, button) {
    if (confirm('Are you sure you want to delete this family?')) {
        axios.delete(`http://localhost:9090/api/families/${name}`)
            .then(response => {
                console.log('Delete response:', response.data);
                fetchFamilies(); // Refresh the family list
            })
            .catch(error => console.error('Error deleting family:', error));
    }
}

function openUpdateModal(name) {
    document.getElementById('update-input').value = name;
    document.getElementById('update-modal').style.display = 'block';
    document.getElementById('update-modal').setAttribute('data-active-name', name);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function closeUpdateModal() {
    document.getElementById('update-modal').style.display = 'none';
}

function addFamily() {
    const familyName = document.getElementById('newFamilyName').value;
    if (!familyName) {
        alert("Family name cannot be empty.");
        return;
    }

    const familyDto = {
        name: familyName
    };

    console.log('Sending familyDto to server:', familyDto); 

    axios.post('http://localhost:9090/api/families', familyDto)
        .then(response => {
            console.log('Add response:', response.data); 
            fetchFamilies(); // Refresh the family list
            closeModal();    
        })
        .catch(error => {
            console.error('Error adding family:', error);
            alert('Failed to add family. Please try again.');
        });
}

function saveChanges() {
    const activeName = document.getElementById('update-modal').getAttribute('data-active-name');
    const newName = document.getElementById('update-input').value;
    if (!newName) {
        alert("Family name cannot be empty.");
        return;
    }

    const familyDto = {
        name: newName
    };

    console.log('Updating family:', activeName, 'to new family:', newName); 

    axios.put(`http://localhost:9090/api/families/${activeName}`, familyDto)
        .then(response => {
            console.log('Update response:', response.data); 
            fetchFamilies(); // Refresh the family list
            closeUpdateModal(); 
        })
        .catch(error => {
            console.error('Error updating family:', error);
            alert('Failed to update family. Please try again.');
        });
}

function searchFamily() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const rows = document.querySelectorAll('#familyTableBody tr');

    rows.forEach(row => {
        const familyName = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
        if (familyName.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}