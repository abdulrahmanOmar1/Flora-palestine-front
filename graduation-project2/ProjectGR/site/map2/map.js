document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.jcf-hidden');
    const selectedAreasLabel = document.getElementById('selected-areas');
    const findButton = document.getElementById('save-area');
    const plantsList = document.getElementById('plantsList');

    console.log('Checkboxes:', checkboxes);
    console.log('Selected Areas Label:', selectedAreasLabel);
    console.log('Find Button:', findButton);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedAreas);
    });

    findButton.addEventListener('click', fetchPlants);

    function updateSelectedAreas() {
        const selectedAreas = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.previousElementSibling.innerText);

        selectedAreasLabel.innerText = selectedAreas.join(', ');

        console.log('Selected Areas:', selectedAreas);
    }

    async function fetchPlants(event) {
        event.preventDefault();

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedRegions = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.getAttribute('data-region'));

        console.log('Selected Regions:', selectedRegions);

        try {
            const response = await axios.get('http://127.0.0.1:9090/api/plants/by-cities', {
                params: {
                    cities: selectedRegions // This will let axios handle the array correctly
                },
                paramsSerializer: params => {
                    return selectedRegions.map(city => `cities=${encodeURIComponent(city)}`).join('&');
                }
            });

            console.log('Response Data:', response.data);
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
            <div class="plant-card">
                <img src="${plant.imageUrls[0]}" alt="${plant.normalName}">
                <h4>${plant.normalName}</h4>
                <p>${plant.scientificName}</p>
                <button>Show Details</button>
            </div>
        `).join('');
    }
});
