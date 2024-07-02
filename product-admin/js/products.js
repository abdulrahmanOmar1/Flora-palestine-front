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
});

function fetchProducts() {
    axios.get('URL_TO_YOUR_BACKEND_API/products')
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
                <td>${product.unitSold}</td>
                <td>${product.inStock}</td>
                <td>${product.expireDate}</td>
                <td>
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
    axios.get('URL_TO_YOUR_BACKEND_API/categories')
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
                    <a href="#" class="tm-product-delete-link" data-id="${category.id}">
                        <i class="far fa-trash-alt tm-product-delete-icon"></i>
                    </a>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function deleteProduct(productId) {
    axios.delete(`URL_TO_YOUR_BACKEND_API/products/${productId}`)
        .then(function (response) {
            fetchProducts(); // Refresh the products table
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

    axios.post('URL_TO_YOUR_BACKEND_API/products/delete', { ids: selectedProductIds })
        .then(function (response) {
            fetchProducts(); // Refresh the products table
        })
        .catch(function (error) {
            console.log(error);
        });
}
