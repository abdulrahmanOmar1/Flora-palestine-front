document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://your-backend-api.com/api'; // Update this with your actual API URL

    // Collect form data and submit it
    const checkoutForm = document.querySelector('.form-checkout');
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Collect data from the form
        const formData = {
            firstName: document.getElementById('contact-first-name-3').value,
            lastName: document.getElementById('contact-last-name-3').value,
            companyName: document.getElementById('company-name').value,
            email: document.getElementById('contact-email-3').value,
            phone: document.getElementById('form-phone').value,
            country: document.getElementById('form-country').value,
            streetAddress: document.getElementById('form-street').value,
            apartment: document.getElementById('form-address').value,
            townCity: document.getElementById('form-town').value,
            postcode: document.getElementById('form-postcode').value,
        };

        // Validate form data
        if (!validateFormData(formData)) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Send data to the server using Axios
        axios.post(`${apiUrl}/checkout`, formData)
            .then(response => {
                alert('Order placed successfully!');
                console.log('Order details:', response.data);
            })
            .catch(error => {
                console.error('Error placing order:', error);
                alert('Failed to place the order.');
            });
    });

    // Function to validate form data
    function validateFormData(data) {
        return data.firstName && data.lastName && data.email && data.phone && data.country && data.streetAddress && data.townCity && data.postcode;
    }

    // Function to update totals and other checkout info dynamically if needed
    function updateCheckoutDetails() {
        axios.get(`${apiUrl}/checkout-details`)
            .then(response => {
                // Update the UI based on response
                document.querySelector('.price').textContent = `$${response.data.total}`;
            })
            .catch(error => {
                console.error('Error fetching checkout details:', error);
            });
    }

    // Optionally update details on page load or when needed
    updateCheckoutDetails();

    // Listen for changes in input to dynamically update content if necessary
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('change', function() {
            if (validateFormData(collectFormData())) {
                updateCheckoutDetails();
            }
        });
    });

    // Collect data from form inputs for validation
    function collectFormData() {
        return {
            firstName: document.getElementById('contact-first-name-3').value,
            lastName: document.getElementById('contact-last-name-3').value,
            email: document.getElementById('contact-email-3').value,
            phone: document.getElementById('form-phone').value,
            country: document.getElementById('form-country').value,
            streetAddress: document.getElementById('form-street').value,
            townCity: document.getElementById('form-town').value,
            postcode: document.getElementById('form-postcode').value,
        };
    }
});
