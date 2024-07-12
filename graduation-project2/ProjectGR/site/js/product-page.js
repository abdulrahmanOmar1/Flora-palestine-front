document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:9090/api/products';
    const cartApiUrl = 'http://localhost:9090/api/carts';
    const userId = Cookies.get('userId'); 
    const productId = getProductIdFromUrl();
    console.log(`Fetched Product ID: ${productId}`);
    fetchProductDetails(productId);
    fetchRelatedProducts(productId);
    setupModal();

    function getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    function fetchProductDetails(productId) {
        if (!productId) {
            console.error('No product ID found in URL');
            Swal.fire({
                title: 'Error',
                text: 'Invalid product ID',
                icon: 'error',
                allowOutsideClick: false // Prevent closing the alert by clicking outside
            });
            return;
        }

        axios.get(`${apiUrl}/product/${productId}`)
            .then(response => {
                displayProductDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to load product details. Please try again later.',
                    icon: 'error',
                    allowOutsideClick: false // Prevent closing the alert by clicking outside
                });
            });
    }

    function displayProductDetails(product) {
        console.log('Product Details:', product);
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.description;

        const originalPrice = product.price;
        const discountedPrice = product.priceAfterDis;

        let priceHtml;
        if (discountedPrice < originalPrice) {
            priceHtml = `<span class="price heading-4">₪${discountedPrice.toFixed(2)}</span> <span class="price-before-sale heading-4">₪${originalPrice.toFixed(2)}</span>`;
        } else {
            priceHtml = `<span class="price heading-4">₪${originalPrice.toFixed(2)}</span>`;
        }
        document.getElementById('product-price').innerHTML = priceHtml;

        document.getElementById('product-image').src = product.imageUrl;

        const quantityInput = document.querySelector('.form-input');
        quantityInput.min = 1;
        quantityInput.value = 1;
        quantityInput.max = product.quantity;

        // Adding buttons for increment and decrement
        const quantityContainer = document.querySelector('.product-number');
        quantityContainer.innerHTML = `
            <button class="quantity-btn" id="decrement-btn">-</button>
            <input class="form-input" type="number" value="1" min="1" max="${product.quantity}">
            <button class="quantity-btn" id="increment-btn">+</button>
        `;

        const decrementBtn = document.getElementById('decrement-btn');
        const incrementBtn = document.getElementById('increment-btn');
        const quantityField = quantityContainer.querySelector('input');

        decrementBtn.addEventListener('click', () => {
            let value = parseInt(quantityField.value);
            if (value > 1) {
                quantityField.value = value - 1;
            }
        });

        incrementBtn.addEventListener('click', () => {
            let value = parseInt(quantityField.value);
            if (value < product.quantity) {
                quantityField.value = value + 1;
            }
        });

        const addToCartButton = document.querySelector('.button-primary');
        addToCartButton.addEventListener('click', function() {
            const quantity = parseInt(quantityField.value);
            addToCartButton.disabled = true; // Disable the button to prevent multiple clicks
            addToCart(product.id, quantity, product.quantity).finally(() => {
                addToCartButton.disabled = false; // Re-enable the button
            });
        });
    }

    function fetchRelatedProducts(productId) {
        axios.get(`${apiUrl}/${productId}/related`)
            .then(response => {
                displayRelatedProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching related products:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to load related products. Please try again later.',
                    icon: 'error',
                    allowOutsideClick: false // Prevent closing the alert by clicking outside
                });
            });
    }

    function displayRelatedProducts(products) {
        const container = document.getElementById('related-products');
        container.innerHTML = '';

        products.forEach(product => {
            const productHtml = `
                <div class="item">
                    <div class="product-card">
                        <a href="product-page.html?id=${product.id}">
                            <img src="${product.imageUrl}" alt="${product.name}">
                        </a>
                        <div class="product-card-body">
                            <h5 class="product-card-title">
                                <a href="product-page.html?id=${product.id}">${product.name}</a>
                            </h5>
                            <div class="product-card-price">₪${(product.priceAfterDis ?? product.price).toFixed(2)}</div>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += productHtml;
        });

        $('#related-products').owlCarousel({
            loop: true,
            margin: 10,
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
                    <img src="${imgSrc}" alt="Product Image" style="width:100%">
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

    window.addToCart = function (productId, quantity, availableQuantity) {
        if (!userId) {
            Swal.fire({
                title: 'Error',
                text: 'You must be logged in to add items to the cart.',
                icon: 'error',
                allowOutsideClick: false // Prevent closing the alert by clicking outside
            });
            return;
        }
        if (quantity > availableQuantity) {
            Swal.fire({
                title: 'Error',
                text: `Sorry, only ${availableQuantity} units of this product are available.`,
                icon: 'error',
                allowOutsideClick: false // Prevent closing the alert by clicking outside
            });
            return;
        }

        axios.post(`${cartApiUrl}/${userId}/items`, null, {
            params: {
                productId: productId,
                quantity: quantity
            }
        })
        .then(response => {
            Swal.fire({
                title: 'Success',
                text: 'Product added to cart successfully!',
                icon: 'success',
                allowOutsideClick: false // Prevent closing the alert by clicking outside
            }).then(() => {
                window.location.href = 'shopping-cart.html';
            });
        })
        .catch(error => {
            console.error('Error adding product to cart:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 500) {
                Swal.fire({
                    title: 'Error',
                    text: 'Sorry, this product is out of stock.',
                    icon: 'error',
                    allowOutsideClick: false // Prevent closing the alert by clicking outside
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to add product to cart. Please try again later.',
                    icon: 'error',
                    allowOutsideClick: false // Prevent closing the alert by clicking outside
                });
            }
        });
    };
});
