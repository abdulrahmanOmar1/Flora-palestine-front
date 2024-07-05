document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:9090/api/products';
    const cartApiUrl = 'http://localhost:9090/api/carts';
    const userId = Cookies.get('userId'); 
    const productId = getProductIdFromUrl();
    console.log(`Fetched Product ID: ${productId}`);
    fetchProductDetails(productId);
    setupModal();

    function getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    function fetchProductDetails(productId) {
        if (!productId) {
            console.error('No product ID found in URL');
            alert('Invalid product ID');
            return;
        }

        axios.get(`${apiUrl}/product/${productId}`)
            .then(response => {
                displayProductDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                alert('Failed to load product details. Please try again later.');
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

        quantityInput.addEventListener('input', function() {
            let value = parseInt(quantityInput.value);
            if (value < 1) quantityInput.value = 1;
            if (value > product.quantity) quantityInput.value = product.quantity;
        });

        document.querySelector('.button-primary').addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            addToCart(product.id, quantity, product.quantity);
        });
    }

    function addToCart(productId, quantity, availableQuantity) {
        if (!userId) {
            alert('You must be logged in to add items to the cart.');
            return;
        }
        if (quantity > availableQuantity) {
            alert(`Sorry, only ${availableQuantity} units of this product are available.`);
            return;
        }

        axios.post(`${cartApiUrl}/${userId}/items`, null, {
            params: {
                productId: productId,
                quantity: quantity
            }
        })
        .then(response => {
            window.location.href = 'shopping-cart.html';
        })
        .catch(error => {
            console.error('Error adding product to cart:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 500) {
                alert('Sorry, this product is out of stock.');
            } else {
                alert('Failed to add product to cart. Please try again later.');
            }
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

    function navigateToProductPage(productId) {
        console.log(`Navigating to product page with ID: ${productId}`);
        window.location.href = `product-page.html?id=${productId}`;
    }
});
