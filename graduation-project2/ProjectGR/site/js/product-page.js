document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:9090/api/products'; // تأكد من أن هذا هو الرابط الصحيح لـ API
    const productId = getProductIdFromUrl();
    console.log(`Fetched Product ID: ${productId}`); // تحقق من معرف المنتج هنا
    fetchProductDetails(productId);
    setupModal();
});

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function fetchProductDetails(productId) {
    axios.get(`${apiUrl}/${productId}`)
        .then(response => {
            displayProductDetails(response.data);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

function displayProductDetails(product) {
    console.log('Product Details:', product); // سجل تفاصيل المنتج للتحقق
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = `₪${product.price}`;
    document.getElementById('product-image').src = product.imageUrl;

    const productDetails = document.getElementById('product-details');
    productDetails.innerHTML = `
        <li>Quantity available: ${product.quantity}</li>
    `;
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
    console.log(`Navigating to product page with ID: ${productId}`); // تحقق من معرف المنتج هنا
    window.location.href = `product-page.html?id=${productId}`;
}
