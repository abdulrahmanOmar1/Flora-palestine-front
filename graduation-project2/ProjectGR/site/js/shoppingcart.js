document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://your-backend-api.com/cart'; // Update this with your API endpoint

    // Function to update the total price of the cart
    function updateCartTotal() {
        axios.get(`${apiUrl}/total`)
            .then(response => {
                const total = response.data.total;
                document.querySelector('.table-shopping-cart tfoot td:last-child').textContent = `$${total.toFixed(2)}`;
            })
            .catch(error => {
                console.error('Error fetching total:', error);
                alert('Failed to update cart total.');
            });
    }

    // Remove item from the cart
    document.querySelectorAll('.table-shopping-cart .material-icons-close').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            axios.delete(`${apiUrl}/remove/${productId}`)
                .then(response => {
                    const row = this.closest('tr');
                    row.parentNode.removeChild(row);
                    updateCartTotal();
                })
                .catch(error => {
                    console.error('Error removing product:', error);
                    alert('Failed to remove product from cart.');
                });
        });
    });

    // Apply coupon code
    const couponButton = document.querySelector('.form-coupon .button-primary');
    couponButton.addEventListener('click', function(event) {
        event.preventDefault();
        const couponCode = document.getElementById('coupon-code').value;
        axios.post(`${apiUrl}/apply-coupon`, { couponCode })
            .then(response => {
                const newTotal = response.data.newTotal;
                document.querySelector('.table-shopping-cart tfoot td:last-child').textContent = `$${newTotal.toFixed(2)}`;
            })
            .catch(error => {
                console.error('Error applying coupon:', error);
                alert('Invalid coupon code!');
            });
    });

    // Update cart event
    const updateCartButton = document.querySelector('.button-group-vertical .button-primary');
    updateCartButton.addEventListener('click', function(event) {
        event.preventDefault();
        updateCartTotal();
    });
});
