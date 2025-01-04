document.addEventListener('DOMContentLoaded', function () {
    checkUserAuthentication();
});

axios.defaults.withCredentials = true;

function checkUserAuthentication() {
    const userId = Cookies.get('userId');
    const userEmail = Cookies.get('userEmail');
    const role = Cookies.get('role');

    if (userId && userEmail && role) {
        console.log(`User authenticated: ${userEmail}, Role: ${role}`);
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) userMenu.style.display = 'block';

        const loginLink = document.querySelector('.login-link');
        if (loginLink) loginLink.style.display = 'none';

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                sessionStorage.clear();
                Cookies.remove('userId');
                Cookies.remove('userEmail');
                Cookies.remove('role');
                window.location.replace('login.html');
            });
        }

        // Load data after authentication check
        fetchOrdersData();
        fetchChartData();
    } else {
        console.log("No user information found in cookies.");
        window.location.replace('login.html');
    }
}

function fetchOrdersData() {
    console.log('Fetching orders data from backend');
    axios.get('http://localhost:9090/api/orders')
        .then(function (response) {
            const orders = response.data;
            console.log('Orders data fetched:', orders);
            populateOrdersTable(orders);
        })
        .catch(function (error) {
            console.log('Error fetching orders data:', error);
        });
}

function populateOrdersTable(orders) {
    const tableBody = document.querySelector('#ordersTable tbody');
    tableBody.innerHTML = ''; // Clear existing data

    orders.forEach(order => {
        const status = order.status ? order.status.toLowerCase() : 'unknown'; // Handle undefined or null status
        const totalPrice = order.amount !== undefined ? `${order.amount} ₪` : 'N/A';
        const userEmail = order.email !== undefined ? order.email : 'N/A';
        const orderDate = order.createdAt !== undefined ? order.createdAt : 'N/A';

        const row = `
            <tr data-order-id="${order.id}" style="cursor: pointer;">
                <th scope="row"><b>#${order.id}</b></th>
                <td><div class="tm-status-circle ${status}"></div>${order.status || 'Unknown'}</td>
                <td><b>${totalPrice}</b></td>
                <td>${userEmail}</td>
                <td>${orderDate}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Add click event listener to each row
    document.querySelectorAll('#ordersTable tbody tr').forEach(row => {
        row.addEventListener('click', function () {
            const orderId = this.getAttribute('data-order-id');
            showOrderItemsModal(orderId);
        });
    });
}

function showOrderItemsModal(orderId) {
    axios.get(`http://localhost:9090/api/orders/${orderId}`)
        .then(function (response) {
            const order = response.data;
            displayOrderDetails(order);
        })
        .catch(function (error) {
            console.log('Error fetching order details:', error);
        });
}

function displayOrderDetails(order) {
    document.getElementById('modalOrderId').textContent = order.id;
    document.getElementById('modalOrderStatus').textContent = order.status;
    document.getElementById('modalOrderTotalPrice').textContent = `${order.amount} ₪`;
    document.getElementById('modalOrderUserEmail').textContent = order.email;
    document.getElementById('modalOrderDate').textContent = order.createdAt;
    document.getElementById('modalPaymentMethod').textContent = order.paymentMethod;
    document.getElementById('modalOrderAddress').textContent = `${order.street}, ${order.city}, ${order.country}`;

    const orderItemsList = document.getElementById('orderItemsList');
    orderItemsList.innerHTML = ''; // Clear existing items

    order.items.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div>
                <h6 class="my-0">${item.productName}</h6>
                <small class="text-muted">Price: ${item.price} ₪</small>
            </div>
            <span class="text-muted">Quantity: ${item.quantity}</span>
        `;
        orderItemsList.appendChild(listItem);
    });

    // Show the modal
    $('#orderItemsModal').modal('show');
}

function fetchChartData() {
    axios.get('http://localhost:9090/api/orders/statistics')
        .then(function (response) {
            const data = response.data;
            console.log('Chart data fetched:', data); // Log the data to verify
            drawOrdersChart(data);
        })
        .catch(function (error) {
            console.log('Error fetching chart data:', error);
        });
}

function drawOrdersChart(data) {
    console.log('Original Data:', data);

    const labels = data.map(item => moment(item.date).format('YYYY-MM-DD')); // Format dates as strings
    const totalValues = data.map(item => item.totalAmount);
    const meanValues = data.map(item => item.mean);
    const stdDevValues = data.map(item => item.stdDev);

    console.log('Labels:', labels);
    console.log('Total Values:', totalValues);
    console.log('Mean Values:', meanValues);
    console.log('StdDev Values:', stdDevValues);

    const ctx = document.getElementById('ordersChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Amount of Completed Orders',
                    data: totalValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Mean Order Value',
                    data: meanValues,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Standard Deviation',
                    data: stdDevValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'YYYY-MM-DD',
                        displayFormats: {
                            day: 'YYYY-MM-DD'
                        }
                    },
                    ticks: {
                        source: 'data',
                        callback: function (value) {
                            return value; // Date is already formatted
                        }
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function (tooltipItems) {
                            return tooltipItems[0].label; // Date is already formatted
                        },
                        label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.raw;
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        }
    });
}