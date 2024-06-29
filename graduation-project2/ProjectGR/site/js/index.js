document.addEventListener("DOMContentLoaded", function() {
    // Initialize Swiper
    var swiper = new Swiper('.swiper-container', {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
    });

    // Preloader
    var preloader = document.querySelector('.preloader');
    window.addEventListener('load', function() {
        preloader.style.display = 'none';
    });

    const itemsPerPage = 9;

    // Search functionality
    var searchInput = document.getElementById('searchInput');
    var searchButton = document.querySelector('.btn-outline-primary');
    var searchResults = document.getElementById('searchResults');
    const plantsContainer = document.querySelector('.plants-container');
    const paginationContainer = document.querySelector('.pagination');

    searchInput.addEventListener('input', function() {
        var query = searchInput.value.trim();
        if (query.length > 0) {
            // Send search query to backend
            axios.get(`http://localhost:9090/plants/search?name=${query}&page=0&size=9`)
            .then(function(response) {
                // Handle successful response
                console.log(response.data);
                // Update search results
                paginationContainer.innerHTML = '';
                updateSearchResults(response.data.content);
                updatePlantsUI(response.data.content, 0);
                updatePagination(response.data.totalPages, 0, searchPlants, query);
            })
            .catch(function(error) {
                // Handle error
                console.error(error);
            });
        } else {
            searchResults.innerHTML = ''; // Clear search results if query is empty
            searchResults.style.display = 'none';
        }
    });

    searchButton.addEventListener('click', function(page = 0, size = 9) {
        var query = searchInput.value.trim();
        if (query.length > 0) {
            // Send search query to backend
            axios.get(`http://localhost:9090/plants/search?name=${query}&${page}&${size}`)
            .then(function(response) {
                // Handle successful response
                console.log(response.data);
                // Update UI with search results
                updatePlantsUI(response.data.content, page);
                
                updatePagination(response.data.totalPages, page, searchPlants);
            })
            .catch(function(error) {
                // Handle error
                console.error(error);
            });
        }
    });

    function updateSearchResults(plants) {
        searchResults.innerHTML = ''; // Clear existing content
        plants.forEach(function(plant) {
            var plantElement = `
                <a class="dropdown-item" href="plantpage.html?id=${plant.id}">
                    ${plant.normalName}
                </a>
            `;
            searchResults.insertAdjacentHTML('beforeend', plantElement);
        });
        searchResults.style.display = plants.length > 0 ? 'block' : 'none'; // Toggle dropdown visibility
    }

    function updatePlantsUI(plants, page) {
        plantsContainer.innerHTML = ''; // Clear existing content
        plants.forEach(function(plant) {
            var plantElement = `
                <div class="col-lg-4 col-sm-6">
                  <div class="box-product">
                    <div class="box-product-img"><a href="plantpage.html?id=${plant.id}"><img src="${plant.imageUrl}" width="270" height="264" loading="lazy"/></a></div>
                    <p><a href="plantpage.html?id=${plant.id}">${plant.normalName}</a></p>
                    <a class="button button-xs button-primary" href="plantpage.html?id=${plant.id}">Show details</a>
                  </div>
                </div>
            `;
            plantsContainer.insertAdjacentHTML('beforeend', plantElement);
        });
    }

    function fetchPlants(page = 0, size = 9) {
        axios.get(`http://localhost:9090/plants/all?page=${page}&size=${size}`)
        .then(function(response) {
            // Handle successful response
            console.log(response.data);
            // Update UI with plants data
            updatePlantsUI(response.data.content, page);
            updatePagination(response.data.totalPages, page, fetchPlants);
        })
        .catch(function(error) {
            // Handle error
            console.error(error);
        });
    }

    function fetchPlantsByFamily(family, page = 0, size = 9) {
        console.log(`Fetching plants for family: ${family}`);
        axios.get(`http://localhost:9090/plants/by-family?family=${family}&page=${page}&${size}`)
        .then(function(response) {
            // Handle successful response
            console.log('Plants fetched by family:', response.data);
            // Update UI with plants data
            updatePlantsUI(response.data.content, page);
            updatePagination(response.data.totalPages, page, function(newPage){
                fetchPlantsByFamily(family, newPage);
            });
        })
        .catch(function(error) {
            // Handle error
            console.error('Error fetching plants by family:', error);
        });
    }

    function fetchCategories() {
        axios.get('http://localhost:9090/plants/families')
        .then(function(response) {
            // Handle successful response
            console.log('Categories fetched:', response.data);
            // Update UI with categories data
            updateCategoriesUI(response.data);
        })
        .catch(function(error) {
            // Handle error
            console.error('Error fetching categories:', error);
        });
    }

    function updateCategoriesUI(categories) {
        var categoriesContainer = document.querySelector('.list-marked');
        categoriesContainer.innerHTML = ''; // Clear existing content
        categories.forEach(function(category) {
            var categoryElement = `<li><a href="#" data-family="${category}">${category}</a></li>`;
            categoriesContainer.insertAdjacentHTML('beforeend', categoryElement);
        });

        // Add event listeners to category links
        var categoryLinks = document.querySelectorAll('.list-marked a');
        categoryLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                var family = this.getAttribute('data-family');
                fetchPlantsByFamily(family, 0);
            });
        });
    }

    function updatePagination(totalPages, currentPage, fetchFunction) {
        paginationContainer.innerHTML = ''; // Clear existing content
        for (let i = 0; i < totalPages; i++) {
            const pageItem = document.createElement('div');
            pageItem.classList.add('page-item');
            if (i === currentPage) {
                pageItem.classList.add('active');
            }
            pageItem.innerHTML = `<a href="#" data-page="${i}">${i + 1}</a>`;
            pageItem.addEventListener('click', function(event) {
                event.preventDefault();
                fetchFunction(i);
            });
            paginationContainer.appendChild(pageItem);
        }
    }

    fetchPlants();
    fetchCategories();

    var navbarToggle = document.querySelector('.rd-navbar-toggle');
    var navbarNavWrap = document.querySelector('.rd-navbar-nav-wrap');

    navbarToggle.addEventListener('click', function() {
        navbarNavWrap.classList.toggle('open');
    });

    var socialLinks = document.querySelectorAll('.fa-facebook, .fa-google-plus, .fa-linkedin, .fa-twitter');

    socialLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Social media link clicked!');
        });
    });

    var exploreButton = document.querySelector('.button-wrap .button');

    exploreButton.addEventListener('click', function(event) {
        event.preventDefault();
        alert('Explore more plants button clicked!');
    });

    var newsletterForm = document.querySelector('.newsletter-form');
    var emailInput = document.querySelector('.newsletter-form input[type="text"]');

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var email = emailInput.value.trim();

        if (email) {
            axios.post('https://your-backend-api.com/newsletter', { email: email })
            .then(function(response) {
                alert('Thank you for subscribing!');
                emailInput.value = ''; // Clear the input field
            })
            .catch(function(error) {
                console.error(error);
                alert('There was an error subscribing. Please try again later.');
            });
        } else {
            alert('Please enter a valid email address.');
        }
    });
});