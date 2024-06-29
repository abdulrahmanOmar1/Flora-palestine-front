

document.addEventListener('DOMContentLoaded', function() {
  window.onload = function() {
    document.querySelector('.preloader').style.display = 'none';
  };

  const teamCarousel = document.querySelector('.owl-carousel.owl-classic');
  if (teamCarousel) {
    $(teamCarousel).owlCarousel({
      items: 1,
      loop: false,
      margin: 30,
      dots: true,
      nav: true,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        1024: { items: 3 }
      }
    });
  }

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value;

      if (email) {
        axios.post('/subscribe', { email: email })
          .then(function(response) {
            if (response.data.success) {
              alert('Thank you for subscribing!');
            } else {
              alert('There was an error. Please try again.');
            }
          })
          .catch(function(error) {
            alert('There was an error. Please try again.');
            console.error('Error:', error);
          });
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }
});
