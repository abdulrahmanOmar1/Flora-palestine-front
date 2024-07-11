document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".form-checkout");
    const placeOrderBtn = document.getElementById("place-order-btn");

    const userId = Cookies.get('userId');
    let subtotal = 0.00;
    let amount = 0.00;

    if (!userId) {
        // Redirect to index.html if no orderId is found
        window.location.href = 'index.html';
        return;
    }

    axios.get(`http://localhost:9090/api/carts/${userId}`)
        .then(response => {
            const order = response.data;
            const orderTableBody = document.querySelector('.table-custom tbody');

            // Clear existing rows
            orderTableBody.innerHTML = '';

            // Populate order details
            order.items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a class="link" href="#">${item.productName}</a></td>
                    <td class="price price-dark">₪${item.productPrice}</td>
                    <td class="price price-dark">${item.quantity}</td>
                `;
                orderTableBody.appendChild(row);
                subtotal += item.productPrice * item.quantity;
            });

            // Add subtotal and total
            const subtotalRow = document.createElement('tr');
            subtotalRow.innerHTML = `
                <td>Subtotal</td>
                <td class="price">₪${subtotal.toFixed(2)}</td>
                <td class="price"></td>
            `;
            orderTableBody.appendChild(subtotalRow);

            amount = order.totalPrice;
            const totalRow = document.createElement('tr');
            totalRow.innerHTML = `
                <td>Total</td>
                <td class="price price-dark">₪${amount}</td>
                <td class="price price-dark"></td>
            `;
            orderTableBody.appendChild(totalRow);
        })
        .catch(error => {
            console.error("There was an error fetching the order details!", error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error fetching your order details. Please try again.',
                icon: 'error',
                allowOutsideClick: false
            });
        });

    placeOrderBtn.addEventListener("click", function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            country: formData.get("country"),
            city: formData.get("town"),
            street: formData.get("street"),
            amount: amount,
            userId: userId,
            paymentMethod: document.querySelector('input[name="input-group-radio"]:checked').value
        };

        // Store billing details in session storage
        sessionStorage.setItem('billingDetails', JSON.stringify(data));

        // Set billing details in cookies
        document.cookie = `billingDetails=${JSON.stringify(data)};path=/;`;

        // Send data to the server
        axios.post('http://localhost:9090/createOrder', null, { params: data })
            .then(response => {
                if (response.data.href) {
                    Swal.fire({
                        title: 'Success',
                        text: 'Order placed successfully!',
                        icon: 'success',
                        allowOutsideClick: false
                    }).then(() => {
                        window.location.href = response.data.href; // Redirect to PayPal approval link
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No approval link found. Please try again.',
                        icon: 'error',
                        allowOutsideClick: false
                    });
                }
            })
            .catch(error => {
                console.error("There was an error placing the order!", error);
                Swal.fire({
                    title: 'Error',
                    text: 'There was an error placing your order. Please try again.',
                    icon: 'error',
                    allowOutsideClick: false
                });
            });
    });
});
