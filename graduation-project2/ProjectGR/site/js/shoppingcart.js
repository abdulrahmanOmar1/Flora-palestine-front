document.addEventListener('DOMContentLoaded', function () {
    const userId = 1;

    function fetchCart() {
        axios.get(`http://localhost:9090/api/carts/${userId}`)
            .then(response => {
                displayCart(response.data);
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
                alert('Failed to fetch cart.');
            });
    }

    function displayCart(cart) {
        const container = document.querySelector('#cart-items');
        container.innerHTML = ''; // Clear previous cart items
        let totalPrice = 0;
        if (cart.items.length === 0) {
            container.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
            document.getElementById('total-price').textContent = '0 ₪';
            return;
        }
        cart.items.forEach(item => {
            totalPrice += item.productPrice * item.quantity;
            const itemHtml = `
                <tr>
                    <th scope="row">
                        <div class="d-flex align-items-center">
                            <img src="${item.productImageUrl}" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="${item.productName}">
                        </div>
                    </th>
                    <td>
                        <p class="mb-0 mt-4">${item.productName}</p>
                    </td>
                    <td>
                        <p class="mb-0 mt-4">${item.productPrice} ₪</p>
                    </td>
                    <td>
                        <div class="input-group quantity mt-4" style="width: 100px;">
                            <div class="input-group-btn">
                                <button class="btn btn-sm btn-minus rounded-circle bg-light border" onclick="updateQuantity(${item.productId}, ${item.quantity - 1}, ${item.productQuantity})">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </div>
                            <input type="text" class="form-control form-control-sm text-center border-0" value="${item.quantity}" disabled>
                            <div class="input-group-btn">
                                <button class="btn btn-sm btn-plus rounded-circle bg-light border" onclick="updateQuantity(${item.productId}, ${item.quantity + 1}, ${item.productQuantity})">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="mb-0 mt-4">${item.productPrice * item.quantity} ₪</p>
                    </td>
                    <td>
                        <button class="btn btn-md rounded-circle bg-light border mt-4" onclick="removeFromCart(${item.productId})">
                            <i class="fa fa-times text-danger"></i>
                        </button>
                    </td>
                </tr>`;
            container.innerHTML += itemHtml;
        });
        document.getElementById('total-price').textContent = `${totalPrice} ₪`;
    }

    window.updateQuantity = function(productId, quantity, availableQuantity) {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (quantity > availableQuantity) {
            alert(`Sorry, only ${availableQuantity} units of this product are available.`);
            return;
        }

        axios.put(`http://localhost:9090/api/carts/${userId}/update`, null, {
            params: {
                productId: productId,
                quantity: quantity
            }
        })
        .then(response => {
            fetchCart();
        })
        .catch(error => {
            console.error('Error updating cart item quantity:', error);
            alert('The product is out of stock ');
        });
    }

    window.removeFromCart = function(productId) {
        axios.delete(`http://localhost:9090/api/carts/${userId}/remove/${productId}`)
        .then(response => {
            fetchCart();
        })
        .catch(error => {
            console.error('Error removing cart item:', error);
            alert('Failed to remove cart item.');
        });
    }

    fetchCart();
});
