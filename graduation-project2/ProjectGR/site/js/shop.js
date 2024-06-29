document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://your-backend-api.com/products'; // Update this to your API endpoint
    let currentPage = 1;
    const itemsPerPage = 9;
    const searchInput = document.querySelector('.form-control');
    const searchButton = document.getElementById('search-icon-1');

    // Update the display of items in the cart
    function updateCartDisplay() {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-item-count').innerText = itemCount; // Ensure this ID matches your HTML
    }

    // Add an item to the cart
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
    }

    // Handle errors
    function handleError(error) {
        console.error('An error occurred:', error);
        alert('Failed to fetch products. Please try again later.');
    }

    // Fetch products from the backend using Axios
    function fetchProducts(page, category = '', keywords = '') {
        const url = `${apiUrl}?page=${page}&limit=${itemsPerPage}&category=${encodeURIComponent(category)}&search=${encodeURIComponent(keywords)}`;
        axios.get(url)
            .then(response => {
                const products = response.data.products;
                displayProducts(products);
                setupPagination(response.data.total, category, keywords);
            })
            .catch(handleError);
    }

    // Display products in the HTML
    function displayProducts(products) {
        const container = document.getElementById('product-container');
        container.innerHTML = ''; // Clear previous products
        products.forEach(product => {
            const productHtml = `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">$${product.price}</p>
                            <button onclick='addToCart(${JSON.stringify(product)})' class="btn btn-primary">Add to Cart</button>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += productHtml;
        });
    }

    // Setup pagination based on total items returned from the backend
    function setupPagination(totalItems, category, keywords) {
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = ''; // Clear previous pagination links
        for (let i = 1; i <= pageCount; i++) {
            paginationContainer.innerHTML += `<a href="#" class="rounded ${i === currentPage ? 'active' : ''}" onclick="changePage(${i}, '${category}', '${keywords}')">${i}</a>`;
        }
    }

    // Change page function to handle pagination
    window.changePage = (page, category, keywords) => {
        currentPage = page;
        fetchProducts(page, category, keywords);
    };

    // Handle search with debounce
    let searchDebounceTimer;
    searchInput.addEventListener('keyup', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            const keywords = searchInput.value.trim();
            fetchProducts(1, '', keywords);
            currentPage = 1;
        }, 300); // Delay in milliseconds
    });

    // Handle category selection
    const categoryLinks = document.querySelectorAll('.fruite-categorie a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            const categoryName = this.textContent.trim();
            document.querySelectorAll('.fruite-categorie a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            fetchProducts(1, categoryName, ''); // Fetch products of the selected category, clear any search
            currentPage = 1;
        });
    });

    // Initial fetch of products
    fetchProducts(currentPage);
    updateCartDisplay(); // Initial cart update
});
