function setupModal() {
    const images = document.querySelectorAll('.box-product-img img');
    images.forEach(image => {
        image.addEventListener('click', () => openModal(image.src));
    });
}

function openModal(imgSrc) {
    const modalHtml = `
        <div id="modal" class="modal" onclick="closeModal(event)">
            <span class="modal-close">&times;</span>
            <img class="modal-content" src="${imgSrc}">
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeModal(event) {
    if (event.target.className.includes('modal-close') || event.target.className.includes('modal')) {
        document.getElementById('modal').remove();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchPlants();  
    setupSearch(); 
});

function fetchPlants() {
    fetch('api/plants') 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayPlants(data);  
        setupLazyLoading(); 
    })
    .catch(error => {
        console.error('Error fetching plants:', error);
        displayAlert('Failed to load plants. Please try again later.', 'error');
    });
}

function displayPlants(plants) {
    const container = document.querySelector('.row-30');
    container.innerHTML = ''; 
    plants.forEach(plant => {
        const html = `
            <div class="col-lg-4 col-sm-6">
                <div class="box-product">
                    <div class="box-product-img"><a href="#"><img data-src="${plant.imageUrl}" alt="" width="270" height="264" loading="lazy"></a></div>
                    <p><a href="#">${plant.description}</a></p>
                    <div class="group-sm"><span class="box-product-price">${plant.price ? '$' + plant.price : 'Contact for price'}</span></div>
                    <a class="button button-xs button-primary" href="plantpage.html?plantId=${plant.id}">Show details</a>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const config = {
        rootMargin: '0px 0px 50px 0px',
        threshold: 0.01
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                preloadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, config);

    images.forEach(image => {
        observer.observe(image);
    });
}

function preloadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.onload = () => img.removeAttribute('data-src');
}

function displayAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 5000);
}

function setupSearch() {
    const searchInput = document.querySelector('input[type="search"]');
    let timeout = null;
    searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (searchInput.value.length > 2 || searchInput.value.length === 0) {
                fetchPlants(); // Optionally, pass searchInput.value to your API to fetch filtered data
            }
        }, 300);
    });
}
