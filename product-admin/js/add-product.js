$(function () {
    $("#expire_date").datepicker();
    fetchCategories();

    $('#add-product-form').on('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        addProduct(formData);
    });
});

function fetchCategories() {
    axios.get('URL_TO_YOUR_BACKEND_API/categories')
        .then(function (response) {
            const categories = response.data;
            populateCategoryDropdown(categories);
        })
        .catch(function (error) {
            console.error('Error fetching categories:', error);
        });
}

function populateCategoryDropdown(categories) {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option selected>Select category</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

function addProduct(formData) {
    axios.post('URL_TO_YOUR_BACKEND_API/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(function (response) {
        console.log('Product added:', response.data);
        alert('Product added successfully!');
        // Clear the form
        document.getElementById('add-product-form').reset();
    })
    .catch(function (error) {
        console.error('There was an error adding the product!', error);
    });
}
