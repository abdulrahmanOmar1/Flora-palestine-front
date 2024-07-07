document.getElementById('area-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const selectedAreas = [];
    const selectedAreaNames = [];
    const checkboxes = document.querySelectorAll('.jcf-hidden:checked');

    checkboxes.forEach(checkbox => {
        selectedAreas.push(checkbox.getAttribute('data-region-id'));
        selectedAreaNames.push(checkbox.previousElementSibling.textContent.trim());
    });

    // Display selected areas in the "Selected Areas" section
    const selectedAreasContainer = document.getElementById('selected-areas');
    selectedAreasContainer.innerHTML = ''; // Clear previous selections

    selectedAreaNames.forEach(areaName => {
        const span = document.createElement('span');
        span.textContent = areaName;
        selectedAreasContainer.appendChild(span);
        selectedAreasContainer.appendChild(document.createTextNode(', ')); // Add comma separator
    });

    // Remove the last comma
    if (selectedAreasContainer.lastChild) {
        selectedAreasContainer.removeChild(selectedAreasContainer.lastChild);
    }

    // Make an axios POST request to fetch plants based on selected areas
    axios.post('https://your-backend-api-url.com/get-plants', {
        regions: selectedAreas
    })
    .then(function (response) {
        const plants = response.data.plants; // Adjust based on your API response structure
        displayPlants(plants);
    })
    .catch(function (error) {
        console.error('Error fetching plants:', error);
    });
});

function displayPlants(plants) {
    const plantContainer = document.getElementById('plants');
    plantContainer.innerHTML = ''; // Clear previous results

    plants.forEach(plant => {
        const plantElement = document.createElement('div');
        plantElement.classList.add('col-lg-4', 'col-sm-6');
        plantElement.innerHTML = `
            <div class="box-product">
                <div class="box-product-img">
                    <a href="#"><img src="${plant.image}" alt="${plant.name}" width="270" height="264" loading="lazy"/></a>
                </div>
                <p><a href="#">${plant.name}</a></p>
                <p>${plant.description}</p>
                <div class="group-sm"><span class="box-product-price">${plant.price}</span></div>
                <a class="button button-xs button-primary" href="plantpage.html">Show details</a>
            </div>
        `;
        plantContainer.appendChild(plantElement);
    });
}
