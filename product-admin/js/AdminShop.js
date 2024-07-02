        Chart.defaults.global.defaultFontColor = 'white';
        let ctxLine, ctxBar, ctxPie, optionsLine, optionsBar, optionsPie, configLine, configBar, configPie, lineChart, barChart, pieChart;

        // DOM is ready
        $(function () {
            drawLineChart(); // Line Chart
            drawBarChart(); // Bar Chart
            drawPieChart(); // Pie Chart

            $(window).resize(function () {
                updateLineChart();
                updateBarChart();                
            });

            // Fetch data when the page loads
            fetchProductsData();
            fetchCategoriesData();
            fetchOrdersData();
        });

        axios.defaults.withCredentials = true;

        function fetchProductsData() {
            axios.get('URL_TO_YOUR_BACKEND_API/products')
                .then(function (response) {
                    // handle success
                    const products = response.data;
                    populateProductsTable(products);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }

        function populateProductsTable(products) {
            const tableBody = document.querySelector('#productsTable tbody');
            tableBody.innerHTML = ''; // Clear existing data

            products.forEach(product => {
                const row = `
                    <tr>
                        <th scope="row">${product.id}</th>
                        <td>${product.plant}</td>
                        <td>${product.tools}</td>
                        <td>${product.materials}</td>
                        <td>${product.books}</td>
                        <td>${product.seeds}</td>
                        <td>${product.gifts}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }

        function fetchCategoriesData() {
            axios.get('URL_TO_YOUR_BACKEND_API/categories')
                .then(function (response) {
                    // handle success
                    const categories = response.data;
                    populateCategoriesTable(categories);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }

        function populateCategoriesTable(categories) {
            const tableBody = document.querySelector('#categoriesTable tbody');
            tableBody.innerHTML = ''; // Clear existing data

            categories.forEach(category => {
                const row = `
                    <tr>
                        <th scope="row">${category.id}</th>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }

        function fetchOrdersData() {
            axios.get('URL_TO_YOUR_BACKEND_API/orders')
                .then(function (response) {
                    // handle success
                    const orders = response.data;
                    populateOrdersTable(orders);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }

        function populateOrdersTable(orders) {
            const tableBody = document.querySelector('#ordersTable tbody');
            tableBody.innerHTML = ''; // Clear existing data

            orders.forEach(order => {
                const row = `
                    <tr>
                        <th scope="row"><b>#${order.id}</b></th>
                        <td><div class="tm-status-circle ${order.status.toLowerCase()}"></div>${order.status}</td>
                        <td><b>${order.totalPrice} ₪</b></td>
                        <td><b>${order.products}</b></td>
                        <td><b>${order.quantity}</b></td>
                        <td>${order.orderDate}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }

        // Example for posting new data
        function addNewProduct(productData) {
            axios.post('URL_TO_YOUR_BACKEND_API/products', productData)
                .then(function (response) {
                    console.log('Product added:', response.data);
                    fetchProductsData(); // Refresh the table data
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
