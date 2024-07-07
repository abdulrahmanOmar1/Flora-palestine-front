document.addEventListener("DOMContentLoaded", function() {
    // Fetch deleted products and display them in the table
    axios.get('http://localhost:9090/api/products/deleted')
        .then(function(response) {
            const products = response.data;
            const tableBody = document.getElementById('deletedProductsTableBody');
            tableBody.innerHTML = ''; // Clear existing rows

            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                    <td>${product.quantity}</td>
                    <td><img src="${product.imageUrl}" alt="${product.name}" class="img-thumbnail" width="50"></td>
                    <td>${product.category}</td>
                    <td>${product.saleDiscount}</td>
                    <td>${product.priceAfterDiscount}</td>
                    <td><button class="btn btn-success activate-btn" data-id="${product.id}">Activate</button></td>
                `;
                tableBody.appendChild(row);
            });

            // Add event listeners to activate buttons
            document.querySelectorAll('.activate-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    activateProduct(productId);
                });
            });
        })
        .catch(function(error) {
            console.error('Error fetching deleted products:', error);
        });
});

function activateProduct(productId) {
    axios.post(`http://localhost:9090/api/products/activate-product/${productId}`)
        .then(function(response) {
            alert('Product activated successfully!');
            location.reload(); // Reload the page to update the product list
        })
        .catch(function(error) {
            console.error('Error activating product:', error);
            alert('Failed to activate product.');
        });
}
