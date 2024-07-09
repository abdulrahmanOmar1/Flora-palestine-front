document.addEventListener('DOMContentLoaded', function() {
    const plantId = getPlantIdFromUrl();
    fetchPlantDetails(plantId);
    fetchRelatedPlants(plantId);
    fetchComments(plantId);
    setupModal();

    const isLoggedIn = checkUserLoginStatus();
    if (isLoggedIn) {
        displayCommentForm(plantId);
    }
});

function getPlantIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function fetchPlantDetails(plantId) {
    fetch(`http://localhost:9090/api/plants/${plantId}`)
    .then(response => response.json())
    .then(data => displayPlantDetails(data))
    .catch(error => console.error('Error fetching plant details:', error));
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
    .then(response => response.json())
    .then(data => displayRelatedPlants(data))
    .catch(error => console.error('Error fetching related plants:', error));
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

function fetchComments(plantId) {
    fetch(`http://localhost:9090/api/comments/plant/${plantId}`)
    .then(response => response.json())
    .then(data => displayComments(data))
    .catch(error => console.error('Error fetching comments:', error));
}

function displayComments(comments) {
    const commentsSection = document.getElementById('comments-section');
    commentsSection.innerHTML = '';

    comments.forEach(comment => {
        const commentHtml = `
            <div class="comment">
                <p><strong>${comment.userId}</strong> <span class="comment-date">${new Date(comment.createdAt).toLocaleString()}</span></p>
                <p>${comment.comment}</p>
            </div>`;
        commentsSection.innerHTML += commentHtml;
    });
}

function displayCommentForm(plantId) {
    const commentFormSection = document.getElementById('comment-form-section');
    const formHtml = `
        <form id="comment-form">
            <textarea id="comment-input" placeholder="Write your comment here..." required></textarea>
            <button type="submit">Submit</button>
        </form>`;
    commentFormSection.innerHTML = formHtml;

    document.getElementById('comment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        submitComment(plantId);
    });
}

function submitComment(plantId) {
    const commentInput = document.getElementById('comment-input');
    const comment = commentInput.value;

    fetch(`http://localhost:9090/api/comments/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plantId: plantId,
            userId: getUserId(), // افترض أن لديك دالة للحصول على معرف المستخدم الحالي
            comment: comment,
            createdAt: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => {
        commentInput.value = '';
        fetchComments(plantId);
    })
    .catch(error => console.error('Error submitting comment:', error));
}

function checkUserLoginStatus() {
    // افترض أنك تتحقق من حالة تسجيل الدخول من خلال الكوكيز أو الجلسات أو أي آلية أخرى
    return true; // قم بتحديث هذا وفقاً لنظام تسجيل الدخول لديك
}

function getUserId() {
    // افترض أنك تحصل على معرف المستخدم من الجلسة أو الكوكيز أو أي آلية أخرى
    return 1; // قم بتحديث هذا وفقاً لنظام تسجيل الدخول لديك
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
