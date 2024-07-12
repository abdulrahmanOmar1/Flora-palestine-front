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

  // التحقق من تسجيل الدخول وعرض معلومات المستخدم
  if (Cookies.get('userId')) {
    sessionStorage.setItem('isLoggedIn', true);
    sessionStorage.setItem('userId', Cookies.get('userId'));
    sessionStorage.setItem('userEmail', Cookies.get('userEmail'));
    sessionStorage.setItem('role', Cookies.get('role'));

    console.log("User ID:", sessionStorage.getItem('userId'));
    console.log("User Email:", sessionStorage.getItem('userEmail'));

    const userMenuButton = document.querySelector('.user-menu-button');
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('role');

    axios.get(`http://localhost:9090/api/users/${userId}`)
      .then(response => {
        const user = response.data;
        const firstName = user.firstName;
        const lastName = user.lastName;
        const userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

        // تحديث النافبار بمعلومات المستخدم
        const userNavbar = document.querySelector('.list-inline.desktop-element');
        userNavbar.innerHTML = `
          <li class="nav-item">
            <a class="nav-link text-white" href="#">
              ${userInitials}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" id="logoutButton" href="#">Logout</a>
          </li>
        `;
        
        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', function() {
          sessionStorage.clear();
          Cookies.remove('userId');
          Cookies.remove('userEmail');
          Cookies.remove('role');
          window.location.replace('login.html');
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });
  } else {
    console.log("No user information found in cookies.");
    const userNavbar = document.querySelector('.list-inline.desktop-element');
    userNavbar.innerHTML = `
      <li>
        <a class="fa fa-user text-white" href="Login.html" style="font-size: 24px;"></a>
      </li>
    `;
  }
});