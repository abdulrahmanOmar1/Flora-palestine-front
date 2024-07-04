axios.defaults.withCredentials = true;

// DOM is ready
$(function () {
    fetchProducts();
    fetchCategories();

    $('#deleteSelectedButton').on('click', function () {
        deleteSelectedProducts();
    });

    $(document).on('click', '.tm-product-delete-link', function (e) {
        e.preventDefault();
        const productId = $(this).data('id');
        deleteProduct(productId);
    });

    $(document).on('click', '.tm-category-delete-link', function (e) {
        e.preventDefault();
        const categoryId = $(this).data('id');
        deleteCategory(categoryId);
    });

    // Handle edit button click to open popup
    $(document).on('click', '.tm-product-edit-button', function (e) {
        e.preventDefault();
        const productId = $(this).data('id');
        openEditProductPopup(productId);
    });

    // Handle form submission for saving changes (submit event listener)
    $(document).on('submit', '#editProductForm', function (e) {
        e.preventDefault();
        
        // Extract form data
        const productId = $('#editProductId').val();
        const updatedProduct = {
            name: $('#editProductName').val(),
            description: $('#editProductDescription').val(),
            price: $('#editProductPrice').val(),
            imageUrl: $('#editProductImageUrl').val(),
            categoryId: $('#editProductCategoryId').val(),
            adminId: 1 // Assuming adminId is a constant locally
        };
    
        // Update product details via PUT request
        axios.put(`http://localhost:9090/api/products/${productId}`, updatedProduct)
            .then(function () {    
                // Now upload images
                console.log("----------");
                const images = $('#editProductImages')[0].files; // Get images from file input
                console.log(images);
                if (images.length > 0) {
                    const formData = new FormData();
                    for (let i = 0; i < images.length; i++) {
                        formData.append('images', images[i]);
                    }

                    console.log("-----********");
                    axios.post(`http://localhost:9090/productImage/${updatedProduct.name}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function () {
                        console.log('Images uploaded successfully');
                        $('#editProductModal').modal('hide');
                        fetchProducts(); // Refresh the products table after image upload
                    })
                    .catch(function (error) {
                        console.log(error);
                        alert('Error uploading images. Please try again.');
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
                alert('Error updating product. Please try again.');
            });
    });
});    

function fetchProducts() {
    axios.get('http://localhost:9090/api/products/active')
        .then(function (response) {
            const products = response.data;
            populateProductsTable(products);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function populateProductsTable(products) {
    const tableBody = document.querySelector('#productsTableBody');
    tableBody.innerHTML = ''; // Clear existing data

    products.forEach(product => {
        const row = `
            <tr>
                <th scope="row"><input type="checkbox" class="productCheckbox" data-id="${product.id}" /></th>
                <td class="tm-product-name">${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td><img src="${product.imageUrl}" class="tm-product-img" alt="${product.name}" width="90" height="90" loading="lazy"></td>
                <td>${product.categoryId}</td>
                <td>
                    <a href="#" class="tm-product-edit-button" data-id="${product.id}">
                        <i class="fas fa-pencil-alt tm-product-edit-icon"></i>
                    </a>
                    <a href="#" class="tm-product-delete-link" data-id="${product.id}">
                        <i class="far fa-trash-alt tm-product-delete-icon"></i>
                    </a>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function fetchCategories() {
    axios.get('http://localhost:9090/api/categories/active')
        .then(function (response) {
            const categories = response.data;
            populateCategoriesTable(categories);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function populateCategoriesTable(categories) {
    const tableBody = document.querySelector('#categoriesTableBody');
    tableBody.innerHTML = ''; // Clear existing data

    categories.forEach(category => {
        const row = `
            <tr>
                <td class="tm-product-name">${category.name}</td>
                <td class="text-center">
                    <a href="#" class="tm-category-delete-link" data-id="${category.id}">
                        <i class="far fa-trash-alt tm-product-delete-icon"></i>
                    </a>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function deleteProduct(productId) {
    axios.delete(`http://localhost:9090/api/products/${productId}`)
        .then(function (response) {
            fetchProducts(); // Refresh the products table
        })
        .catch(function (error) {
            console.log(error);
        });
}

function deleteCategory(categoryId) {
    axios.delete(`http://localhost:9090/api/categories/${categoryId}`)
        .then(function (response) {
            fetchCategories(); // Refresh the categories table
            fetchProducts();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function deleteSelectedProducts() {
    const selectedProductIds = [];
    document.querySelectorAll('.productCheckbox:checked').forEach(checkbox => {
        selectedProductIds.push(checkbox.dataset.id);
    });

    axios.post('http://localhost:9090/api/products/delete', { ids: selectedProductIds })
        .then(function (response) {
            fetchProducts(); // Refresh the products table
        })
        .catch(function (error) {
            console.log(error);
        });
}

function openEditProductPopup(productId) {
    // Fetch product details by productId
    axios.get(`http://localhost:9090/api/products/product/${productId}`)
        .then(function (response) {
            const product = response.data;

            // Populate form fields with product data
            $('#editProductId').val(product.id);
            $('#editProductName').val(product.name);
            $('#editProductDescription').val(product.description);
            $('#editProductPrice').val(product.price);
            $('#editProductImageUrl').val(product.imageUrl);
            $('#editProductCategoryId').val(product.categoryId);

            // Show the modal
            $('#editProductModal').modal('show');
        })
        .catch(function (error) {
            console.log(error);
            alert('Error loading product details. Please try again.');
        });
}
