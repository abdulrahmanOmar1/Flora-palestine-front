$(function () {
    fetchCategories();

    $('#add-product-form').on('submit', function (event) {
        event.preventDefault();
        addProduct();
    });
});

function fetchCategories() {
    axios.get('http://localhost:9090/api/categories/active')
        .then(function (response) {
            const categories = response.data;
            console.log(categories);
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

function addProduct() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const categoryId = document.getElementById('category').value;
    const quantity = document.getElementById('quantity').value;
    const saleDiscount = document.getElementById('saleDiscount').value || 0;

    const adminId = 1;

    const productData = {
        name: name,
        description: description,
        price: price,
        categoryId: categoryId,
        adminId: adminId,
        quantity: quantity,
        saleDiscount: saleDiscount
    };

    axios.post('http://localhost:9090/api/products/new', productData)
        .then(function (response) {
            console.log('Product added:', response.data);
            const productName = response.data.name;
            console.log(productName);
            const imageFile = document.getElementById('fileInput').files[0];

            if (imageFile) {
                uploadImage(productName, imageFile);
            } else {
                alert('Product added successfully!');
                document.getElementById('add-product-form').reset();
                clearCache('products_'); // Clear product cache
            }
        })
        .catch(function (error) {
            console.error('There was an error adding the product!', error);
        });
}

function uploadImage(productName, imageFile) {
    const formData = new FormData();
    formData.append('images', imageFile);

    axios.post(`http://localhost:9090/productImage/${productName}`, formData)
        .then(function (response) {
            console.log('Image uploaded:', response.data);
            alert('Product and image added successfully!');
            document.getElementById('add-product-form').reset();
            clearCache('products_'); // Clear product cache
        })
        .catch(function (error) {
            console.error('There was an error uploading the image!', error);
        });
}

function clearCache(keyPrefix) {
    Object.keys(localStorage)
        .filter(key => key.startsWith(keyPrefix))
        .forEach(key => localStorage.removeItem(key));
}