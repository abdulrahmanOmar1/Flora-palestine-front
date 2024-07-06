document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(".form-checkout");
  const placeOrderBtn = document.getElementById("place-order-btn");

  placeOrderBtn.addEventListener("click", function(event) {
      event.preventDefault();

      const formData = new FormData(form);

      const data = {
          name: formData.get("name"),
          phone: formData.get("phone"),
          country: formData.get("country"),
          city: formData.get("town"),
          street: formData.get("street"),
          amount: 25.60, // يمكن تحديث هذا المبلغ بناءً على سلة التسوق الفعلية
          userId: 1, // Replace with actual user ID
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
                  alert("Order placed successfully!");
                  console.log(response.data);
                  window.location.href = response.data.href; // Redirect to PayPal approval link
              } else {
                  alert("No approval link found. Please try again.");
              }
          })
          .catch(error => {
              console.error("There was an error placing the order!", error);
              alert("There was an error placing your order. Please try again.");
          });
  });
});