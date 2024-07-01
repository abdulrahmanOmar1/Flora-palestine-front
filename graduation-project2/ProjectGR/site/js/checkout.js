document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".form-checkout");
  
    form.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const formData = new FormData(form);
  
      const data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        country: formData.get("country"),
        city: formData.get("town"),
        street: formData.get("street"),
        paymentMethod: document.querySelector('input[name="input-group-radio"]:checked').value
      };
  
      // Store billing details in session storage
      sessionStorage.setItem('billingDetails', JSON.stringify(data));
  
      // Set billing details in cookies
      document.cookie = `billingDetails=${JSON.stringify(data)};path=/;`;
  
      // Send data to the server
      axios.post('https://your-backend-url/api/checkout', data, {
        withCredentials: true // Include cookies in the request
      })
        .then(response => {
          alert("Order placed successfully!");
          console.log(response.data);
        })
        .catch(error => {
          console.error("There was an error placing the order!", error);
          alert("There was an error placing your order. Please try again.");
        });
    });
  });
  