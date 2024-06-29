document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://your-backend-api.com/api'; // Update this with your actual API URL

    // Function to fetch products based on category or search
    function fetchProducts(category = '') {
        axios.get(`${apiUrl}/products?category=${encodeURIComponent(category)}`)
            .then(response => {
                displayProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }

    // Display products on the page
    function displayProducts(products) {
        const container = document.getElementById('product-container');
        container.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            container.innerHTML += `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;
        });
    }

    // Function to add a product to the cart
    function addToCart(productId) {
        axios.post(`${apiUrl}/cart`, { productId })
            .then(() => {
                alert('Product added to cart');
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
            });
    }

    // Listen for category changes and fetch products
    document.querySelectorAll('.fruite-categorie a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.innerText.trim();
            fetchProducts(category);
        });
    });

    // Initially load all products
    fetchProducts();

    // Handle pagination (you need to implement server-side pagination support)
    document.querySelectorAll('.pagination a').forEach(pageLink => {
        pageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const page = this.getAttribute('data-page'); // Make sure links have a 'data-page' attribute
            axios.get(`${apiUrl}/products?page=${page}`)
                .then(response => {
                    displayProducts(response.data);
                })
                .catch(error => {
                    console.error('Error changing page:', error);
                });
        });
    });
});
