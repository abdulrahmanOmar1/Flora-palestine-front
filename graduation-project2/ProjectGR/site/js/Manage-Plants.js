document.addEventListener('DOMContentLoaded', function() {
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
            <td><img src="${plant.imageUrl}" alt="${plant.normalName}" width="50" height="50"></td>
            <td>${plant.description}</td>
            <td>${plant.plantUsage}</td>
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
    
    document.getElementById('updatePlantImage').value = '';

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
    const formData = new FormData();
    
    const scientificName = document.getElementById('newScientificName').value;
    const normalName = document.getElementById('newPlantName').value;
    const family = document.getElementById('newFamily').value;
    const description = document.getElementById('newPlantDescription').value;
    const plantUsage = document.getElementById('newPlantUsage').value;
    const file = document.getElementById('newPlantImage').files[0];

    const plantData = {
        scientificName,
        normalName,
        family,
        description,
        plantUsage
    };

    formData.append('plant', JSON.stringify(plantData));
    formData.append('file', file);

    axios.post("http://localhost:9090/api/plants/add", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log('Plant added successfully:', response.data);
        fetchAllPlants();
        closeModal();
    })
    .catch(error => console.error('Error adding plant:', error));
}

function saveChanges() {
    const activeId = document.getElementById('update-modal').getAttribute('data-active-id');
    
    const formData = new FormData();
    formData.append('normalName', document.getElementById('updatePlantName').value);
    formData.append('scientificName', document.getElementById('updateScientificName').value);
    formData.append('family', document.getElementById('updateFamily').value);
    formData.append('description', document.getElementById('updatePlantDescription').value);
    formData.append('plantUsage', document.getElementById('updatePlantUsage').value);
    if (document.getElementById('updatePlantImage').files.length > 0) {
        formData.append('imageUrl', document.getElementById('updatePlantImage').files[0]);
    }

    axios.put(`http://localhost:9090/api/plants/update/${activeId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log('Plant updated successfully:', response.data);
        fetchAllPlants();
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
