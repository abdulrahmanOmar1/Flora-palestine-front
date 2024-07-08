document.addEventListener('DOMContentLoaded', function() {
    const plantId = getPlantIdFromUrl();
    fetchPlantDetails(plantId);
    fetchRelatedPlants(plantId);
    setupModal();
});

function getPlantIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function fetchPlantDetails(plantId) {
    fetch(`http://localhost:9090/api/plants/${plantId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayPlantDetails(data);
    })
    .catch(error => {
        console.error('Error fetching plant details:', error);
        displayAlert('Failed to load plant details. Please try again later.', 'error');
    });
}

function displayPlantDetails(plant) {
    document.getElementById('plantName').textContent = plant.normalName;
    document.getElementById('plantDescription').textContent = plant.description;
    document.getElementById('plantScientificName').textContent = `Scientific Name: ${plant.scientificName}`;
    document.getElementById('plantFamily').textContent = `Family: ${plant.family}`;
    document.getElementById('plantUsage').textContent = `Usage: ${plant.plantUsage}`;
    document.getElementById('plantCities').textContent = `Cities: ${plant.cities.join(', ')}`;
    document.getElementById('plantColor').textContent = `Color: ${plant.color}`;

    const carouselParent = document.querySelector('.carousel-parent');
    const childCarousel = document.querySelector('#child-carousel');

    carouselParent.innerHTML = '';
    childCarousel.innerHTML = '';

    if (plant.imageUrls.length > 0) {
        const parentSlide = document.createElement('div');
        parentSlide.classList.add('item');

        const imgElement = document.createElement('img');
        imgElement.src = plant.imageUrls[0];
        imgElement.alt = plant.normalName;
        imgElement.width = 470;
        imgElement.height = 486;
        imgElement.loading = 'lazy';

        parentSlide.appendChild(imgElement);
        carouselParent.appendChild(parentSlide);
    }

    plant.imageUrls.slice(1).forEach(imageUrl => {
        const childSlide = document.createElement('div');
        childSlide.classList.add('item');

        const overlay = document.createElement('div');
        overlay.classList.add('slick-slide-overlay');

        const childImg = document.createElement('img');
        childImg.src = imageUrl;
        childImg.alt = plant.normalName;
        childImg.width = 117;
        childImg.height = 108;
        childImg.loading = 'lazy';

        overlay.appendChild(childImg);
        childSlide.appendChild(overlay);
        childCarousel.appendChild(childSlide);
    });

    $('.carousel-parent').slick({
        arrows: false,
        loop: false,
        dots: false,
        swipe: true,
        items: 1,
        asNavFor: '#child-carousel'
    });

    $('#child-carousel').slick({
        arrows: true,
        loop: false,
        dots: false,
        swipe: false,
        items: 2,
        vertical: false,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    items: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    items: 4
                }
            }
        ],
        asNavFor: '.carousel-parent'
    });
}

function fetchRelatedPlants(plantId) {
    fetch(`http://localhost:9090/api/plants/similar/${plantId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayRelatedPlants(data);
    })
    .catch(error => {
        console.error('Error fetching related plants:', error);
        displayAlert('Failed to load related plants. Please try again later.', 'error');
    });
}

function displayRelatedPlants(plants) {
    const container = document.getElementById('related-plants');
    container.innerHTML = '';

    plants.forEach(plant => {
        const plantHtml = `
            <div class="box-product">
                <div class="box-product-img"><a href="plantpage.html?id=${plant.id}"><img src="${plant.imageUrls[0]}" alt="${plant.normalName}" width="270" height="264" loading="lazy"/></a></div>
                <p><a href="plantpage.html?id=${plant.id}">${plant.normalName}</a></p>
            </div>`;
        container.innerHTML += plantHtml;
    });

    $('#related-plants').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
        items: 4,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true
    });
}

function setupModal() {
    const images = document.querySelectorAll('.slick-slide-overlay img');
    images.forEach(image => {
        image.addEventListener('click', () => openModal(image.src));
    });
}

function openModal(imgSrc) {
    const modalHtml = `
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="${imgSrc}" alt="Plant Image" style="width:100%">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.querySelector('.modal').style.display = 'block';
}

function closeModal(event) {
    if (event.target.className.includes('close') || event.target.classList.contains('modal')) {
        document.querySelector('.modal').remove();
    }
}

function displayAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', alertHtml);
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}
