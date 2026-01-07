// Reuse the showPopup function from previous code if not already defined
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

// Password validation function
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push("at least 8 characters");
  if (!hasUpperCase) errors.push("an uppercase letter");
  if (!hasLowerCase) errors.push("a lowercase letter");
  if (!hasNumber) errors.push("a number");
  if (!hasSpecialChar) errors.push("a special character");

  return errors;
}

// Main registration handler
async function handleRegistration(event) {
  event.preventDefault();
  
  // Get input values
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;

  // Basic validation
  if (!username || !email || !password || !confirmPassword) {
      showPopup(false, "Please fill in all fields");
      return;
  }

  // Username validation
  if (username.length < 3) {
      showPopup(false, "Username must be at least 3 characters long");
      return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      showPopup(false, "Please enter a valid email address");
      return;
  }

  // Password validation
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
      showPopup(false, `Password must contain ${passwordErrors.join(", ")}`);
      return;
  }

  // Confirm password
  if (password !== confirmPassword) {
      showPopup(false, "Passwords do not match");
      return;
  }

  try {
      // Show loading state
      const submitButton = document.querySelector('.button-group button');
      const originalButtonText = submitButton.textContent;
      submitButton.innerHTML = 'Registering...';
      submitButton.disabled = true;

      const response = await fetch('http://localhost:3000/auth/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username,
              email,
              password
          })
      });

      const data = await response.json();

      if (response.ok) {
          showPopup(true, "Registration successful! Redirecting to login...");
          
          // Clear form
          document.querySelector('.registration-form').reset();

          // Redirect to login page after delay
          setTimeout(() => {
              window.location.href = 'loginpage.html';
          }, 2000);
      } else {
          showPopup(false, data.message || 'Registration failed. Please try again.');
      }
  } catch (error) {
      console.error('Registration error:', error);
      showPopup(false, 'Network error. Please check your connection and try again.');
  } finally {
      // Reset button state
      const submitButton = document.querySelector('.button-group button');
      submitButton.innerHTML = 'Register';
      submitButton.disabled = false;
  }
}

// Add CSS for validation feedback and popups
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

  .input-group input.invalid {
      border-color: #f44336;
  }

  .input-group input.valid {
      border-color: #4CAF50;
  }

  .button-group button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
  }
`;
document.head.appendChild(style);

// Add event listener to form
document.querySelector('.registration-form').addEventListener('submit', handleRegistration);

// Real-time validation
document.getElementById('reg-email').addEventListener('input', function(e) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  this.classList.toggle('valid', emailRegex.test(this.value));
  this.classList.toggle('invalid', this.value && !emailRegex.test(this.value));
});

document.getElementById('reg-password').addEventListener('input', function(e) {
  const errors = validatePassword(this.value);
  this.classList.toggle('valid', errors.length === 0);
  this.classList.toggle('invalid', this.value && errors.length > 0);
});

document.getElementById('reg-confirm-password').addEventListener('input', function(e) {
  const password = document.getElementById('reg-password').value;
  this.classList.toggle('valid', this.value && this.value === password);
  this.classList.toggle('invalid', this.value && this.value !== password);
});

document.getElementById('reg-username').addEventListener('input', function(e) {
  this.classList.toggle('valid', this.value.length >= 3);
  this.classList.toggle('invalid', this.value && this.value.length < 3);
});

























