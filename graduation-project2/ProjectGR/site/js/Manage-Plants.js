document.addEventListener('DOMContentLoaded', function() {

    const userId = Cookies.get('userId');
    const userEmail = Cookies.get('userEmail');
    const userRole = Cookies.get('role');

    if (!userId || !userEmail || !userRole) {
        alert('You must be logged in to access this page.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    fetchAllPlants();
    fetchFamilies();

    document.getElementById('addPlantBtn').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'block';
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        filterPlants();
    });

    document.getElementById('familyFilter').addEventListener('change', function() {
        filterPlants();
    });
});

function fetchAllPlants() {
    axios.get('http://localhost:9090/api/plants/allWithoutPagination')
        .then(response => {
            const plants = response.data; // Get plants from the response without pagination
            console.log(plants); // Check if plants are fetched correctly
            populatePlantsTable(plants);
        })
        .catch(error => console.error('Error fetching plants:', error));
}

function fetchFamilies() {
    axios.get('http://localhost:9090/api/families')
        .then(response => {
            const families = response.data;
            console.log(families); // Check if families are fetched correctly
            populateFamilyDropdowns(families);
        })
        .catch(error => console.error('Error fetching families:', error));
}

function populatePlantsTable(plants) {
    const tbody = document.getElementById('plantTableBody');
    tbody.innerHTML = ''; 
    
    plants.forEach((plant, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td id="plant-${plant.id}">${plant.normalName}</td>
            <td>${plant.scientificName}</td>
            <td>${plant.family}</td>
            <td><img src="${plant.imageUrls[0]}" alt="${plant.normalName}" width="70" height="70"></td>
            <td>${plant.description}</td>
            <td>${plant.plantUsage}</td>
            <td>${plant.city}</td>
            <td>${plant.color}</td>
            <td><button class="btn red" onclick="deletePlant(${plant.id}, this)">Delete</button></td>
            <td><button class="btn green update-btn" data-id="${plant.id}" onclick="openUpdateModal(${plant.id})">Update</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function populateFamilyDropdowns(families) {
    const newFamilyDropdown = document.getElementById('newFamily');
    const updateFamilyDropdown = document.getElementById('updateFamily');
    const familyFilterDropdown = document.getElementById('familyFilter');
    
    newFamilyDropdown.innerHTML = '';  // Clear existing options
    updateFamilyDropdown.innerHTML = '';  // Clear existing options
    familyFilterDropdown.innerHTML = '<option value="all">All Families</option>';  // Clear existing options and add 'All Families'

    families.forEach(family => {
        const option = document.createElement('option');
        option.value = family.name;
        option.textContent = family.name;
        newFamilyDropdown.appendChild(option.cloneNode(true));
        updateFamilyDropdown.appendChild(option.cloneNode(true));
        familyFilterDropdown.appendChild(option);
    });
}

function deletePlant(id, button) {
    if (confirm('Are you sure you want to delete this plant?')) {
        axios.delete(`http://localhost:9090/api/plants/delete/${id}`)
            .then(response => {
                const row = button.parentNode.parentNode;
                row.parentNode.removeChild(row);
                fetchAllPlants(); // Refresh the plant list
            })
            .catch(error => console.error('Error deleting plant:', error));
    }
}

function openUpdateModal(id) {
    const plant = document.getElementById('plant-' + id).parentElement;
    document.getElementById('updatePlantName').value = plant.querySelector('td:nth-child(2)').textContent;
    document.getElementById('updateScientificName').value = plant.querySelector('td:nth-child(3)').textContent;
    document.getElementById('updateFamily').value = plant.querySelector('td:nth-child(4)').textContent;
    document.getElementById('updatePlantDescription').value = plant.querySelector('td:nth-child(6)').textContent;
    document.getElementById('updatePlantUsage').value = plant.querySelector('td:nth-child(7)').textContent;
    document.getElementById('updateCity').value = plant.querySelector('td:nth-child(8)').textContent;
    document.getElementById('updateColor').value = plant.querySelector('td:nth-child(9)').textContent;
    
    document.getElementById('update-modal').style.display = 'block';
    document.getElementById('update-modal').setAttribute('data-active-id', id);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function closeUpdateModal() {
    document.getElementById('update-modal').style.display = 'none';
}

function addPlant() {
    const scientificName = document.getElementById('newScientificName').value;
    const normalName = document.getElementById('newPlantName').value;
    const family = document.getElementById('newFamily').value;
    const description = document.getElementById('newPlantDescription').value;
    const plantUsage = document.getElementById('newPlantUsage').value;
    const city = document.getElementById('city').value;
    const color = document.getElementById('color').value;
    const imageFiles = document.getElementById('newPlantImages').files;

    if (!normalName || !scientificName || imageFiles.length === 0 || !family) {
        alert('Please fill in all required fields (Plant Name, Scientific Name, Family, and select at least one image).');
        return;
    }

    const plantData = {
        scientificName,
        normalName,
        family,
        description,
        plantUsage,
        city,
        color
    };

    axios.post("http://localhost:9090/api/plants/add", plantData)
        .then(response => {
            const scientificName = response.data.scientificName;
            console.log(response.data);
            uploadImages(scientificName, imageFiles);
            closeModal();
        })
        .catch(error => console.error('Error adding plant:', error));
}

function uploadImages(scientificName, imageFiles) {
    const formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
    }

    axios.post(`http://localhost:9090/api/plant-image/${scientificName}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log('Images uploaded successfully:', response.data);
        fetchAllPlants(); // Refresh the plant list
    })
    .catch(error => console.error('Error uploading images:', error));
}

function saveChanges() {
    const activeId = document.getElementById('update-modal').getAttribute('data-active-id');
    
    const formData = new FormData();
    formData.append('normalName', document.getElementById('updatePlantName').value);
    formData.append('scientificName', document.getElementById('updateScientificName').value);
    formData.append('family', document.getElementById('updateFamily').value);
    formData.append('description', document.getElementById('updatePlantDescription').value);
    formData.append('plantUsage', document.getElementById('updatePlantUsage').value);
    formData.append('city', document.getElementById('updateCity').value);
    formData.append('color', document.getElementById('updateColor').value);

    axios.put(`http://localhost:9090/api/plants/update/${activeId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log('Plant updated successfully:', response.data);
        fetchAllPlants(); // Refresh the plant list
        closeUpdateModal();
    })
    .catch(error => console.error('Error updating plant:', error));
}

function filterPlants() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedFamily = document.getElementById('familyFilter').value.toLowerCase();
    
    const rows = document.querySelectorAll('#plantTableBody tr');
    rows.forEach(row => {
        const plantName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const plantFamily = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        
        const matchesSearchTerm = plantName.includes(searchTerm);
        const matchesFamilyFilter = selectedFamily === 'all' || plantFamily === selectedFamily;

        if (matchesSearchTerm && matchesFamilyFilter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Initialize Select2 for the family filter and color select
$(document).ready(function() {
    $('#familyFilter').select2({
        placeholder: 'Select a family',
        allowClear: false // Disable the clear button
    });
    $('#color').select2({
        placeholder: 'Select a color',
        allowClear: false // Disable the clear button
    });
    $('#newFamily').select2();
    $('#updateFamily').select2();
});