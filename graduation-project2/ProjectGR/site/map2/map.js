document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.jcf-hidden');
    const selectedAreasLabel = document.getElementById('selected-areas');
    const findButton = document.getElementById('save-area');
    const plantsContainer = document.getElementById('plantsContainer');
    const plantsList = document.getElementById('plantsList');
    const plantDetails = document.createElement('div');
    plantDetails.classList.add('plant-details');
    plantsContainer.appendChild(plantDetails);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedAreas);
    });

    findButton.addEventListener('click', fetchPlants);

    function updateSelectedAreas() {
        const selectedAreas = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.previousElementSibling.innerText);

        selectedAreasLabel.innerText = selectedAreas.join(', ');
    }

    async function fetchPlants(event) {
        event.preventDefault();

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedRegions = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.getAttribute('data-region'));

        try {
            const response = await axios.get('http://127.0.0.1:9090/api/plants/by-cities', {
                params: {
                    cities: selectedRegions // This will let axios handle the array correctly
                },
                paramsSerializer: params => {
                    return selectedRegions.map(city => `cities=${encodeURIComponent(city)}`).join('&');
                }
            });

            displayPlants(response.data);
        } catch (error) {
            console.error('Error fetching plants:', error);
            if (error.response) {
                console.error('Error Response:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    function displayPlants(plants) {
        plantsList.innerHTML = plants.map(plant => `
            <div class="plant-card" data-id="${plant.id}">
                <img src="${plant.imageUrls[0]}" alt="${plant.normalName}" style="width: 150px; height: 150px; object-fit: cover;">
                <h4>${plant.normalName}</h4>
                <p>${plant.scientificName}</p>
                <button class="show-details">Show Details</button>
            </div>
        `).join('');

        document.querySelectorAll('.show-details').forEach(button => {
            button.addEventListener('click', showPlantDetails);
        });
    }

    async function showPlantDetails(event) {
        const plantId = event.target.closest('.plant-card').getAttribute('data-id');

        try {
            const response = await axios.get(`http://127.0.0.1:9090/api/plants/${plantId}`);

            plantDetails.innerHTML = `
                <button class="back-button">Back</button>
                <h2>${response.data.normalName}</h2>
                <img src="${response.data.imageUrls[0]}" alt="${response.data.normalName}" style="width: 150px; height: 150px; object-fit: cover;">
                <table>
                    <tr>
                        <th>Scientific Name:</th>
                        <td>${response.data.scientificName}</td>
                    </tr>
                    <tr>
                        <th>Family:</th>
                        <td>${response.data.family}</td>
                    </tr>
                    <tr>
                        <th>Usage:</th>
                        <td>${response.data.plantUsage}</td>
                    </tr>
                    <tr>
                        <th>Cities:</th>
                        <td>${response.data.cities.join(', ')}</td>
                    </tr>
                    <tr>
                        <th>Color:</th>
                        <td>${response.data.color}</td>
                    </tr>
                    <tr>
                        <th>Description:</th>
                        <td>${response.data.description}</td>
                    </tr>
                </table>
            `;

            plantsList.style.display = 'none';
            plantDetails.style.display = 'block';

            document.querySelector('.back-button').addEventListener('click', () => {
                plantsList.style.display = 'flex';
                plantDetails.style.display = 'none';
            });
        } catch (error) {
            console.error('Error fetching plant details:', error);
            if (error.response) {
                console.error('Error Response:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        }
    }
});