$(document).ready(function () {
    axios.defaults.withCredentials = true;

    const productId = getProductIdFromURL();

    fetchProductData(productId);
    fetchCategories();

    $('#fileInput').on('change', function () {
        uploadProductImage(productId);
    });

    $('#edit-product-form').on('submit', function (event) {
        event.preventDefault();
        updateProductData(productId);
    });
});

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function fetchProductData(productId) {
    axios.get(`URL_TO_YOUR_BACKEND_API/products/${productId}`)
        .then(function (response) {
            const product = response.data;
            $('#name').val(product.name);
            $('#description').val(product.description);
            $('#expire_date').val(product.expire_date);
            $('#stock').val(product.stock);
            if (product.image) {
                $('#product-image').attr('src', product.image);
            }
        })
        .catch(function (error) {
            console.error('Error fetching product data:', error);
        });
}

function fetchCategories() {
    axios.get('URL_TO_YOUR_BACKEND_API/categories')
        .then(function (response) {
            const categories = response.data;
            const categorySelect = $('#category');
            categorySelect.empty();

            categories.forEach(category => {
                const option = $('<option>', {
                    value: category.id,
                    text: category.name
                });
                categorySelect.append(option);
            });

            // بعد ملء الفئات، نحدد الفئة الحالية للمنتج
            fetchProductData(getProductIdFromURL());
        })
        .catch(function (error) {
            console.error('Error fetching categories:', error);
        });
}

function uploadProductImage(productId) {
    const formData = new FormData();
    formData.append('image', $('#fileInput')[0].files[0]);

    axios.post(`URL_TO_YOUR_BACKEND_API/products/${productId}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(function (response) {
        $('#product-image').attr('src', response.data.image);
        alert('Image uploaded successfully!');
    })
    .catch(function (error) {
        console.error('Error uploading product image:', error);
    });
}

function updateProductData(productId) {
    const data = {
        name: $('#name').val(),
        description: $('#description').val(),
        category: $('#category').val(),
        expire_date: $('#expire_date').val(),
        stock: $('#stock').val()
    };

    axios.put(`URL_TO_YOUR_BACKEND_API/products/${productId}`, data)
        .then(function (response) {
            alert('Product updated successfully!');
            window.location.href = 'products.html';
        })
        .catch(function (error) {
            console.error('Error updating product:', error);
        });
}
