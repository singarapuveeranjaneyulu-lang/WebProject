// Function to show popup notifications
function showPopup(success, message) {
  const popup = document.createElement('div');
  popup.className = `popup ${success ? 'success' : 'error'}`;
  
  popup.innerHTML = `
      <span class="popup-icon">${success ? '✓' : '✕'}</span>
      <span>${message}</span>
      <span class="popup-close" onclick="this.parentElement.remove()">×</span>
  `;
  
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 10);
  
  setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 300);
  }, 3000);
}

// Main login handler
async function handleLogin(event) {
  event.preventDefault();
  
  // Get input values
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Basic validation
  if (!email || !password) {
      showPopup(false, "Please fill in all fields");
      return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      showPopup(false, "Please enter a valid email address");
      return;
  }

  try {
      // Show loading state
      const submitButton = document.querySelector('.button-group button');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = 'Logging in...';
      submitButton.disabled = true;

      const response = await fetch('http://localhost:3000/auth/signin', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: email,
              password: password
          })
      });

      const data = await response.json();

      if (response.ok) {
          // Store token
          localStorage.setItem('authToken', data.jwtToken);
          
          // Show success message
          showPopup(true, "Login successful! Redirecting...");

          // Optional: Store user info if returned from backend
          if (data.user) {
              localStorage.setItem('userName', data.user.username);
          }

          // Redirect after delay
          setTimeout(() => {
              window.location.href = '../Frontend/homepage.html';
          }, 1500);
      } else {
          // Show error message from server
          showPopup(false, data.message || 'Login failed. Please check your credentials.');
      }
  } catch (error) {
      console.error('Login error:', error);
      showPopup(false, 'Network error. Please check your connection and try again.');
  } finally {
      // Reset button state
      const submitButton = document.querySelector('.button-group button');
      submitButton.innerHTML = 'Login';
      submitButton.disabled = false;
  }
}

// Add CSS for popup notifications
const style = document.createElement('style');
style.textContent = `
  .popup {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateX(120%);
      transition: transform 0.3s ease;
      z-index: 1000;
      color: white;
      font-family: Arial, sans-serif;
  }

  .popup.success {
      background-color: #4CAF50;
  }

  .popup.error {
      background-color: #f44336;
  }

  .popup.show {
      transform: translateX(0);
  }

  .popup-icon {
      font-size: 20px;
  }

  .popup-close {
      margin-left: 10px;
      cursor: pointer;
      font-size: 20px;
  }

  .button-group button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
  }
`;
document.head.appendChild(style);

// Add event listener to form
document.querySelector('.login-form').addEventListener('submit', handleLogin);

// Optional: Add input validation as user types
document.getElementById('email').addEventListener('input', function(e) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (this.value && !emailRegex.test(this.value)) {
      this.style.borderColor = '#f44336';
  } else {
      this.style.borderColor = '';
  }
});