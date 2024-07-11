document.addEventListener("DOMContentLoaded", function() {
    if (Cookies.get('userId')) {
        sessionStorage.setItem('isLoggedIn', true);
        sessionStorage.setItem('userId', Cookies.get('userId'));
        sessionStorage.setItem('userEmail', Cookies.get('userEmail'));
        sessionStorage.setItem('role', Cookies.get('role'));

        console.log("User ID:", sessionStorage.getItem('userId'));
        console.log("User Email:", sessionStorage.getItem('userEmail'));

        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'inline-block';

        const loginLink = document.querySelector('.login-link');
        loginLink.style.display = 'none';

        const userMenuButton = document.querySelector('.user-menu-button');
        const userId = sessionStorage.getItem('userId');
        const userRole = sessionStorage.getItem('role');

        axios.get(`http://localhost:9090/api/users/${userId}`)
            .then(response => {
                const user = response.data;
                const firstName = user.firstName;
                const lastName = user.lastName;
                userMenuButton.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`;
            })
            .catch(error => {
                console.log("Error:", error);
            });

        if (userRole === 'ADMIN') {
            const adminLink = document.createElement('a');
            adminLink.href = 'dashbord.html';
            adminLink.textContent = 'Admin';
            adminLink.style.color = 'red';
            adminLink.style.fontWeight = 'bold';

            const userMenuContent = document.querySelector('.user-menu-content');
            userMenuContent.insertBefore(adminLink, userMenuContent.firstChild);
        }

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', function() {
            sessionStorage.clear();
            Cookies.remove('userId');
            Cookies.remove('userEmail');
            Cookies.remove('role');
            window.location.replace('login.html');
        });
    } else {
        console.log("No user information found in cookies.");
        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'none';

        const loginLink = document.querySelector('.login-link');
        loginLink.style.display = 'inline-block';
    }

    var preloader = document.querySelector('.preloader');
    window.addEventListener('load', function() {
        preloader.style.display = 'none';
    });

    const itemsPerPage = 9;
    var searchInput = document.getElementById('searchInput');
    var searchButton = document.querySelector('.btn-outline-primary');
    var searchResults = document.getElementById('searchResults');
    const plantsContainer = document.querySelector('.plants-container');
    const paginationContainer = document.querySelector('.pagination');

    searchInput.addEventListener('input', function() {
        var query = searchInput.value.trim();
        if (query.length > 0) {
            axios.get(`http://localhost:9090/api/plants/search?name=${query}&page=0&size=9`)
                .then(function(response) {
                    paginationContainer.innerHTML = '';
                    updateSearchResults(response.data.content);
                    updatePlantsUI(response.data.content, 0);
                    updatePagination(response.data.totalPages, 0, searchPlants, query);
                })
                .catch(function(error) {
                    console.error(error);
                });
        } else {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
        }
    });

    searchButton.addEventListener('click', function(page = 0, size = 9) {
        var query = searchInput.value.trim();
        if (query.length > 0) {
            axios.get(`http://localhost:9090/api/plants/search?name=${query}&${page}&${size}`)
                .then(function(response) {
                    updatePlantsUI(response.data.content, page);
                    updatePagination(response.data.totalPages, page, searchPlants);
                })
                .catch(function(error) {
                    console.error(error);
                });
        }
    });

    function updateSearchResults(plants) {
        searchResults.innerHTML = '';
        plants.forEach(function(plant) {
            var plantElement = `
                <a class="dropdown-item" href="plantpage.html?id=${plant.id}">
                    ${plant.normalName}
                </a>
            `;
            searchResults.insertAdjacentHTML('beforeend', plantElement);
        });
        searchResults.style.display = plants.length > 0 ? 'block' : 'none';
    }

    function updatePlantsUI(plants, page) {
        plantsContainer.innerHTML = '';
        if (Array.isArray(plants)) {
            plants.forEach(function(plant) {
                var plantElement = `
                    <div class="col-lg-4 col-sm-6">
                      <div class="box-product">
                        <div class="box-product-img"><a href="plantpage.html?id=${plant.id}"><img src="${plant.imageUrls[0]}" width="270" height="264" loading="lazy"/></a></div>
                        <p><a href="plantpage.html?id=${plant.id}">${plant.normalName}</a></p>
                        <a class="button button-xs button-primary" href="plantpage.html?id=${plant.id}">Show details</a>
                      </div>
                    </div>
                `;
                plantsContainer.insertAdjacentHTML('beforeend', plantElement);
            });
        } else {
            console.error('updatePlantsUI: plants is not an array', plants);
        }
    }

    function fetchPlants(page = 0, size = 9) {
        axios.get(`http://localhost:9090/api/plants/all?page=${page}&size=${size}`)
            .then(function(response) {
                updatePlantsUI(response.data.content, page);
                updatePagination(response.data.totalPages, page, fetchPlants);
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    function fetchPlantsByFamily(family, page = 0, size = 9) {
        axios.get(`http://localhost:9090/api/plants/by-family?family=${family}&page=${page}&size=${size}`)
            .then(function(response) {
                updatePlantsUI(response.data.content, page);
                updatePagination(response.data.totalPages, page, function(newPage) {
                    fetchPlantsByFamily(family, newPage);
                });
            })
            .catch(function(error) {
                console.error('Error fetching plants by family:', error);
            });
    }

    function fetchPlantsByColor(color) {
        axios.get(`http://localhost:9090/api/plants/by-color?color=${color}`)
            .then(response => {
                console.log('Plants by color response:', response.data);
                updatePlantsUI(response.data.content);
            })
            .catch(error => {
                console.error('Error fetching plants by color:', error);
            });
    }

    function updatePagination(totalPages, currentPage, fetchFunction) {
        paginationContainer.innerHTML = '';
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

    function fetchCategories() {
        axios.get('http://localhost:9090/api/plants/families')
            .then(function(response) {
                updateCategoriesUI(response.data);
            })
            .catch(function(error) {
                console.error('Error fetching categories:', error);
            });
    }

    function updateCategoriesUI(categories) {
        var categoriesContainer = document.getElementById('familyFilter');
        categoriesContainer.innerHTML = ''; // تفريغ المحتوى السابق
        categories.forEach(function(category) {
            var categoryElement = `<div class="family-option" data-family="${category}">${category}</div>`;
            categoriesContainer.insertAdjacentHTML('beforeend', categoryElement);
        });

        // إضافة معالجات النقر لعناصر الفئة
        var categoryLinks = document.querySelectorAll('.family-option');
        categoryLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                var family = this.getAttribute('data-family');
                fetchPlantsByFamily(family, 0);
            });
        });
    }

    fetchPlants();
    fetchCategories();

    const colorFilterButton = document.getElementById('toggleColorFilterButton');
    colorFilterButton.addEventListener('click', () => {
        document.getElementById('colorFilter').classList.toggle('d-none');
    });

    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            fetchPlantsByColor(color);
        });
    });

    const familyFilterButton = document.getElementById('toggleFamilyFilterButton');
    familyFilterButton.addEventListener('click', () => {
        document.getElementById('familyFilter').classList.toggle('d-none');
    });

    // Add search functionality in the plants section
    const plantSearchInput = document.getElementById('searchInputSmall');
    const plantSearchButton = document.getElementById('searchButtonSmall');
    const searchContainer = document.getElementById('searchContainer');

    plantSearchInput.addEventListener('input', function() {
        var query = plantSearchInput.value.trim();
        if (query.length > 0) {
            axios.get(`http://localhost:9090/api/plants/search?name=${query}&page=0&size=9`)
                .then(function(response) {
                    updatePlantsUI(response.data.content, 0);
                    updatePagination(response.data.totalPages, 0, searchPlants, query);
                })
                .catch(function(error) {
                    console.error(error);
                });
        }
    });

    plantSearchButton.addEventListener('click', function() {
        var query = plantSearchInput.value.trim();
        if (query.length > 0) {
            axios.get(`http://localhost:9090/api/plants/search?name=${query}&page=0&size=9`)
                .then(function(response) {
                    updatePlantsUI(response.data.content, 0);
                    updatePagination(response.data.totalPages, 0, searchPlants, query);
                })
                .catch(function(error) {
                    console.error(error);
                });
        }
    });

    const toggleSearchButton = document.getElementById('toggleSearchButton');
    toggleSearchButton.addEventListener('click', function() {
        searchContainer.classList.toggle('d-none');
    });
});
