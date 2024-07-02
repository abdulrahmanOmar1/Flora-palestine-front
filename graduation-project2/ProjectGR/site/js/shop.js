document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:9090/api';
    const searchInput = document.querySelector('#search-input');
    let currentCategoryId = '';

    function initializeSession() {
        let sessionId = getCookie('sessionId');
        if (!sessionId) {
            sessionId = generateSessionId();
            setCookie('sessionId', sessionId, 7); // Session ID valid for 7 days
        }
    }

    function generateSessionId() {
        return 'session-' + Math.random().toString(36).substr(2, 16);
    }

    function updateCartDisplay() {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartItemCountElement = document.getElementById('cart-item-count');
        if (cartItemCountElement) {
            cartItemCountElement.innerText = itemCount;
        }
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let found = cart.find(p => p.id === product.id);
        if (found) {
            found.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        alert('Product added to cart successfully!');
        updateCartDisplay();
        window.location.href = 'shopping-cart.html';
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function handleError(error) {
        console.error('An error occurred:', error);
        alert('Failed to fetch products. Please try again later.');
    }

    function fetchProducts(categoryId = '', keywords = '') {
        let url;
        if (categoryId) {
            url = `${apiUrl}/categories/category/${categoryId}/products`;
        } else {
            url = `${apiUrl}/products`;
        }

        if (keywords) {
            url += `?search=${encodeURIComponent(keywords)}`;
        }

        fetch(url)
            .then(response => {
                if (response.status === 204) {
                    return [];
                }
                return response.json();
            })
            .then(data => {
                displayProducts(data);
            })
            .catch(handleError);
    }

    function fetchCategories() {
        const url = `${apiUrl}/categories`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                return response.json();
            })
            .then(data => {
                displayCategories(data);
            })
            .catch(handleError);
    }
    function displayProducts(products) {
        const container = document.getElementById('product-container');
        container.innerHTML = ''; // Clear previous products
        if (products.length === 0) {
            container.innerHTML = '<p>No products available in this category.</p>';
            return;
        }
        products.forEach(product => {
            const productHtml = `
                <div class="col-md-6 col-lg-4 col-xl-3">
                    <div class="rounded position-relative fruite-item" onclick='navigateToProductPage(${product.id})'>
                        <div class="fruite-img">
                            <img src="${product.imageUrl}" class="img-fluid w-100 rounded-top" alt="${product.name}">
                        </div>
                        <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                            <div class="d-flex justify-content-between flex-lg-wrap">
                                <p class="text-dark fs-5 fw-bold mb-0">₪${product.price}</p>
                                <button onclick='event.stopPropagation(); addToCart(${JSON.stringify(product)})' class="btn border border-secondary rounded-pill px-3 text-primary">
                                    <i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += productHtml;
        });
    }
    

    function displayCategories(categories) {
        const container = document.getElementById('category-list');
        container.innerHTML = ''; // Clear previous categories
        container.innerHTML += `
            <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="pill" href="#" onclick="changeCategory('')">
                    <span>All Products</span>
                </a>
            </li>`;
        categories.forEach(category => {
            const categoryHtml = `
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="pill" href="#" onclick="changeCategory('${category.id}')">
                        <span>${category.name}</span>
                    </a>
                </li>`;
            container.innerHTML += categoryHtml;
        });
    }

    window.changeCategory = (categoryId) => {
        currentCategoryId = categoryId;
        fetchProducts(categoryId, searchInput.value.trim());
    };

    let searchDebounceTimer;
    searchInput.addEventListener('keyup', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            const keywords = searchInput.value.trim();
            fetchProducts(currentCategoryId, keywords);
        }, 300); // Delay in milliseconds
    });

    window.navigateToProductPage = (productId) => {
        console.log(`Navigating to product page with ID: ${productId}`);
        window.location.href = `product-page.html?id=${productId}`;
    };

    initializeSession();
    fetchProducts();
    fetchCategories();
    updateCartDisplay(); // Initial cart update
});
