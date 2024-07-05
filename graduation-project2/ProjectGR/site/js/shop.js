document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:9090/api';
    const searchInput = document.querySelector('#search-input');
    const sortSelect = document.querySelector('#sort-select');
    const favoriteBtn = document.getElementById('favorite-btn');
    let currentCategoryId = '';
    const userId = 1;
    let likedProductIds = [];
    let currentPage = 0;
    const itemsPerPage = 9;

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

    function fetchProducts(categoryId = '', keywords = '', sort = 'asc', page = 0) {
        let url;
        if (categoryId) {
            url = `${apiUrl}/products/categories/${categoryId}/search?search=${encodeURIComponent(keywords)}&order=${sort}&page=${page}&size=${itemsPerPage}`;
        } else {
            url = `${apiUrl}/products/search?search=${encodeURIComponent(keywords)}&order=${sort}&page=${page}&size=${itemsPerPage}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayProducts(data.content);
                updatePagination(data.totalPages, data.number);
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

    function fetchLikedProducts() {
        const url = `${apiUrl}/likes/user/${userId}/products`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch liked products');
                }
                return response.json();
            })
            .then(data => {
                likedProductIds = data.map(product => product.id);
                fetchProducts(currentCategoryId, searchInput.value.trim(), sortSelect.value, currentPage);
            })
            .catch(handleError);
    }

    function displayProducts(products) {
        const container = document.getElementById('product-container');
        container.innerHTML = '';
    
        products.forEach(product => {
            const isOutOfStock = product.quantity == 0;
            const isLiked = likedProductIds.includes(product.id) ? 'liked' : '';
    
            const originalPrice = product.price;
            const discount = product.saleDiscount || 0; // تأكد من أن الخصم ليس undefined
            const discountedPrice = originalPrice - (originalPrice * (discount / 100));
    
            let priceHtml;
            if (discount > 0) {
                priceHtml = `<div class="product-card-price">₪${discountedPrice.toFixed(2)} <span class="original-price">₪${originalPrice.toFixed(2)}</span></div>`;
            } else {
                priceHtml = `<div class="product-card-price">₪${originalPrice.toFixed(2)}</div>`;
            }
    
            const productHtml = `
                <div class="col-md-4 mb-4 ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
                    <div class="product-card">
                        <a href="product-page.html?id=${product.id}" class="${isOutOfStock ? 'disabled-link' : ''}">
                            <img src="${product.imageUrl}" alt="${product.name}">
                        </a>
                        <div class="product-card-body">
                            <h5 class="product-card-title">
                                <a href="product-page.html?id=${product.id}" class="${isOutOfStock ? 'disabled-link' : ''}">${product.name}</a>
                            </h5>
                            ${priceHtml}
                            <button class="button button-primary ${isOutOfStock ? 'disabled' : ''}" ${isOutOfStock ? 'disabled' : ''} onclick="addToCart(${product.id}, 1)">
                                ${isOutOfStock ? 'Product is out of stock' : 'Add to cart'}
                            </button>
                            <button class="button button-like ${isLiked}" onclick="toggleLike(${product.id}, this)">
                                <i class="fa fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += productHtml;
        });
    
        const disabledLinks = document.querySelectorAll('.disabled-link');
        disabledLinks.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
            });
        });
    }
    
    
    

    function displayCategories(categories) {
        const container = document.getElementById('category-list');
        container.innerHTML = ''; 
        container.innerHTML += `
            <a class="list-group-item list-group-item-action active" onclick="changeCategory('')">All Products</a>`;
        categories.forEach(category => {
            const categoryHtml = `
                <a class="list-group-item list-group-item-action" onclick="changeCategory('${category.id}')">${category.name}</a>`;
            container.innerHTML += categoryHtml;
        });
    }

    window.changeCategory = (categoryId) => {
        currentCategoryId = categoryId;
        currentPage = 0;
        fetchProducts(categoryId, searchInput.value.trim(), sortSelect.value, currentPage);
    };

    window.showFavoriteProducts = () => {
        const url = `${apiUrl}/likes/user/${userId}/products`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch favorite products');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                displayProducts(data);
            })
            .catch(handleError);
    };

    function updatePagination(totalPages, currentPage) {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        for (let i = 0; i < totalPages; i++) {
            const pageItem = document.createElement('button');
            pageItem.classList.add('btn', 'btn-primary', 'mx-1');
            if (i === currentPage) {
                pageItem.classList.add('active');
            }
            pageItem.textContent = i + 1;
            pageItem.addEventListener('click', () => {
                currentPage = i;
                fetchProducts(currentCategoryId, searchInput.value.trim(), sortSelect.value, currentPage);
            });
            paginationContainer.appendChild(pageItem);
        }
    }

    let searchDebounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            const keywords = searchInput.value.trim();
            currentPage = 0;
            fetchProducts(currentCategoryId, keywords, sortSelect.value, currentPage);
        }, 300); 
    });

    sortSelect.addEventListener('change', () => {
        currentPage = 0;
        fetchProducts(currentCategoryId, searchInput.value.trim(), sortSelect.value, currentPage);
    });

    window.navigateToProductPage = (productId) => {
        console.log(`Navigating to product page with ID: ${productId}`);
        window.location.href = `product-page.html?id=${productId}`;
    };

    window.addToCart = function(productId, quantity) {
        axios.post(`${apiUrl}/carts/${userId}/items`, null, {
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
            alert('The product is out of stock.');
        });
    }

    window.toggleLike = function(productId, button) {
        const isLiked = button.classList.contains('liked');
        const url = isLiked 
            ? `${apiUrl}/likes/remove?userId=${userId}&productId=${productId}`
            : `${apiUrl}/likes/add`;

        const data = {
            userId: userId,
            productId: productId
        };

        const request = isLiked ? axios.delete(url, { data }) : axios.post(url, data);

        request.then(response => {
            button.classList.toggle('liked');
            if (isLiked) {
                likedProductIds = likedProductIds.filter(id => id !== productId);
            } else {
                likedProductIds.push(productId);
            }
            console.log(isLiked ? 'Like removed' : 'Like added');
        })
        .catch(error => {
            console.error('Error toggling like:', error);
            alert('Failed to toggle like.');
        });
    }

    fetchLikedProducts(); 
    fetchCategories();
    updateCartDisplay();
});

