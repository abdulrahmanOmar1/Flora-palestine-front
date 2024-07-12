document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.jcf-hidden');
    const selectedAreasLabel = document.getElementById('selected-areas');
    const findButton = document.getElementById('save-area');

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

        const selectedCities = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.getAttribute('data-region-id'));

        console.log('Selected Cities:', selectedCities);

        try {
            const response = await axios.get('http://127.0.0.1:5500/api/plants/by-cities', {
                params: {
                    cities: selectedCities
                }
            });

            console.log('Response Data:', response.data);

            showPlantsPopup(response.data);
        } catch (error) {
            console.error('Error fetching plants:', error);
            if (error.response) {
                console.error('Error Response:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    function showPlantsPopup(plants) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close-popup">&times;</span>
                <h2>Plants in Selected Areas</h2>
                <ul>
                    ${plants.map(plant => `<li>${plant.normalName} (${plant.scientificName})</li>`).join('')}
                </ul>
            </div>
        `;
        document.body.appendChild(popup);

        document.querySelector('.close-popup').addEventListener('click', () => {
            popup.remove();
        });

        console.log('Popup displayed with plants:', plants);
    }
});
