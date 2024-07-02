document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:9090/api';
    const searchInput = document.querySelector('#search-input');
    let currentCategoryId = '';
    const userId = 1;
    


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
                console.log(data);
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

        products.forEach(product => {
            const productHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <article class="product">
                        <div class="product-body">
                            <div class="product-figure"><img src="${product.imageUrl}" alt="" width="270" height="264"/></div>
                            <h5 class="product-title"><a href="product-page.html?id=${product.id}">${product.name}</a></h5>
                            <div class="product-price-wrap">
                                <div class="product-price">₪${product.price}</div>
                            </div>
                            <div class="product-button-wrap">
                                <button class="button button-primary" onclick="addToCart(${product.id}, 1)">Add to cart</button>
                            </div>
                        </div>
                    </article>
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

    window.addToCart = function(productId, quantity) {
        axios.post(`http://localhost:9090/api/carts/${userId}/items`, null, {
            params: {
                productId: productId,
                quantity: quantity
            }
        })
        .then(response => {
            alert('Product added to cart successfully!');
            window.location.href = 'shopping-cart.html';
        })
        .catch(error => {
            console.error('Error adding product to cart:', error);
            alert('The product is out of stock .');
        });
    }

    fetchProducts();


    fetchProducts();
    fetchCategories();
    updateCartDisplay(); 

});
