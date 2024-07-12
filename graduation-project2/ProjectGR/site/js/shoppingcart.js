document.addEventListener('DOMContentLoaded', function () {
    if (Cookies.get('userId')) {
        sessionStorage.setItem('isLoggedIn', true);
        sessionStorage.setItem('userId', Cookies.get('userId'));
        sessionStorage.setItem('userEmail', Cookies.get('userEmail'));
        sessionStorage.setItem('role', Cookies.get('role'));

        console.log("User ID:", sessionStorage.getItem('userId'));
        console.log("User Email:", sessionStorage.getItem('userEmail'));

        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'inline-block';

        const loginLink = document.querySelector('.login-link');
        loginLink.style.display = 'none';

        const userMenuButton = document.querySelector('.user-menu-button');
        const userId = sessionStorage.getItem('userId');
        const userRole = sessionStorage.getItem('role');

        axios.get(`http://localhost:9090/api/users/${userId}`)
            .then(response => {
                const user = response.data;
                const firstName = user.firstName;
                const lastName = user.lastName;
                userMenuButton.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`;
            })
            .catch(error => {
                console.log("Error:", error);
            });

        if (userRole === 'ADMIN') {
            const adminLink = document.createElement('a');
            adminLink.href = 'dashboard.html';
            adminLink.textContent = 'Admin';
            adminLink.style.color = 'red';
            adminLink.style.fontWeight = 'bold';

            const userMenuContent = document.querySelector('.user-menu-content');
            userMenuContent.insertBefore(adminLink, userMenuContent.firstChild);
        }

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', function() {
            sessionStorage.clear();
            Cookies.remove('userId');
            Cookies.remove('userEmail');
            Cookies.remove('role');
            window.location.replace('login.html');
        });
    } else {
        console.log("No user information found in cookies.");
        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'none';

        const loginLink = document.querySelector('.login-link');
        loginLink.style.display = 'inline-block';
    }

    var preloader = document.querySelector('.preloader');
    window.addEventListener('load', function() {
        preloader.style.display = 'none';
    });
});

function fetchCart() {
    const userId = Cookies.get('userId');
    if (!userId) {
        alert('User ID not found in cookies.');
        return;
    }
    console.log('Fetching cart for user:', userId);
    axios.get(`http://localhost:9090/api/carts/${userId}`)
        .then(response => {
            displayCart(response.data);
            console.log('Cart data:', response.data);
        })
        .catch(error => {
            console.error('Error fetching cart:', error);
            alert('Failed to fetch cart.');
        });
}

function displayCart(cart) {
    const container = document.querySelector('#cart-items');
    container.innerHTML = '';
    let totalPrice = 0;
    if (cart.items.length === 0) {
        container.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
        document.getElementById('total-price').textContent = '0 ₪';
        return;
    }
    cart.items.forEach(item => {
        const itemPrice = item.productPriceAfterDis || item.productPrice;
        totalPrice += itemPrice * item.quantity;
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
                    <p class="mb-0 mt-4">${itemPrice} ₪</p>
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
                    <p class="mb-0 mt-4">${itemPrice * item.quantity} ₪</p>
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

function updateQuantity(productId, quantity, availableQuantity) {
    const userId = Cookies.get('userId');
    if (!userId) {
        alert('User ID not found in cookies.');
        return;
    }

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
        alert('The product is out of stock.');
    });
}

function removeFromCart(productId) {
    const userId = Cookies.get('userId');
    if (!userId) {
        alert('User ID not found in cookies.');
        return;
    }

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
