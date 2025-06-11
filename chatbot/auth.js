// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Login Page Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const continueButton = document.getElementById('continue-button');
const emailStep = document.getElementById('email-step');
const phoneStep = document.getElementById('phone-step');
const passwordStep = document.getElementById('password-step');
const displayedEmail = document.getElementById('displayed-email');
const editEmailButton = document.getElementById('edit-email');
const authTitle = document.getElementById('auth-title');
const passwordToggle = document.querySelector('.password-toggle'); 
const phoneLoginButton = document.querySelector('.phone-login-button');
const emailLoginButton = document.querySelector('.email-login-button');
const socialLoginDiv = document.querySelector('.social-login');
const loginPhoneNumberInput = document.getElementById('phone-number');
const loginCountryCodeSelect = document.getElementById('country-code');

// Registration Page Elements
const registerEmailInput = document.getElementById('register-email');
const registerContinueButton = document.getElementById('register-continue-button');
const registerEmailStep = document.getElementById('register-email-step');
const registerPhoneStep = document.getElementById('register-phone-step');
const registrationStep = document.getElementById('registration-step');
const displayedRegisterEmail = document.getElementById('displayed-register-email');
const editRegisterEmailButton = document.getElementById('edit-register-email');
// const registerUsernameInput = document.getElementById('register-username'); 
const registerPasswordInput = document.getElementById('register-password');
const registerConfirmPasswordInput = document.getElementById('register-confirmPassword');
const registerPhoneButton = document.querySelector('.register-phone-button');
const registerEmailButton = document.querySelector('.register-email-button');
const registerPhoneNumberInput = document.getElementById('register-phone-number');
const registerCountryCodeSelect = document.getElementById('register-country-code');
// const registerSocialLoginDiv = document.querySelector('.social-login'); 

// Social Login Buttons (common to both pages if class names are reused)
const googleLoginButton = document.querySelector('.social-button.google');
const microsoftLoginButton = document.querySelector('.social-button.microsoft');
const githubLoginButton = document.querySelector('.social-button.github');
const appleLoginButton = document.querySelector('.social-button.apple');


// Function to reset login view to initial state
function resetLoginView() {
    emailStep.classList.remove('hidden');
    phoneStep.classList.add('hidden');
    passwordStep.classList.add('hidden');
    if (phoneLoginButton) phoneLoginButton.classList.remove('hidden');
    if (emailLoginButton) emailLoginButton.classList.add('hidden');
    if (authTitle) authTitle.textContent = 'Welcome back';
    if (continueButton) continueButton.textContent = 'Continue';
     if (loginForm) loginForm.removeEventListener('submit', handleLoginSubmit);
     if (continueButton) continueButton.removeEventListener('click', handleLoginContinue);
     if (continueButton) continueButton.addEventListener('click', handleLoginContinue);
    // Ensure other social buttons are visible
    if (socialLoginDiv) socialLoginDiv.querySelectorAll('.social-button:not(.phone-login-button):not(.email-login-button)').forEach(button => button.classList.remove('hidden'));

    // Reset phone input on view reset
    if (loginCountryCodeSelect && loginPhoneNumberInput) {
         const selectedCode = loginCountryCodeSelect.value;
         loginPhoneNumberInput.value = selectedCode + ' ';
    }
}

// Function to reset registration view to initial state
function resetRegisterView() {
    registerEmailStep.classList.remove('hidden');
    registerPhoneStep.classList.add('hidden');
    registrationStep.classList.add('hidden');
    if (registerPhoneButton) registerPhoneButton.classList.remove('hidden');
    if (registerEmailButton) registerEmailButton.classList.add('hidden');
    if (authTitle) authTitle.textContent = 'Create Account';
    if (registerContinueButton) registerContinueButton.textContent = 'Continue';
    if (registerForm) registerForm.removeEventListener('submit', handleRegistrationSubmit);
    if (registerContinueButton) registerContinueButton.removeEventListener('click', handleRegistrationContinue);
    if (registerContinueButton) registerContinueButton.addEventListener('click', handleRegistrationContinue);
     // Ensure other social buttons are visible
    if (socialLoginDiv) socialLoginDiv.querySelectorAll('.social-button:not(.register-phone-button):not(.register-email-button)').forEach(button => button.classList.remove('hidden'));

     // Reset phone input on view reset
    if (registerCountryCodeSelect && registerPhoneNumberInput) {
         const selectedCode = registerCountryCodeSelect.value;
         registerPhoneNumberInput.value = selectedCode + ' ';
    }
}

// --- Login Page Logic --- //

// Handle Login Continue button click
const handleLoginContinue = async (e) => {
    e.preventDefault();

    if (emailStep && !emailStep.classList.contains('hidden')) {
        // Currently in email step, proceed to password step
        const email = emailInput.value;

        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        // In a real application, you would typically send a request to your backend here
        // to check if the email exists. For this example, we'll just proceed.

        emailStep.classList.add('hidden');
        passwordStep.classList.remove('hidden');
        displayedEmail.textContent = email;
        authTitle.textContent = 'Enter your password';
        continueButton.textContent = 'Continue'; // Button text for password step

    } else if (phoneStep && !phoneStep.classList.contains('hidden')) {
         // Currently in phone step, handle phone login logic (e.g., send code)
        const countryCode = document.getElementById('country-code').value;
        const phoneNumber = document.getElementById('phone-number').value;

         // Remove the country code and leading space from the entered number
        const phoneNumberOnly = phoneNumber.replace(countryCode + ' ', '');

        if (!phoneNumberOnly) {
            alert('Please enter your phone number.');
            return;
        }


        // For now, let's just log the phone number
        console.log('Phone number entered for login:', countryCode + phoneNumberOnly);


    } else if (passwordStep && !passwordStep.classList.contains('hidden')) {
         handleLoginSubmit(e); 
    }
};

// Handle Login Form Submission (for password step)
const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Ensure this is only handled when the password step is visible
    if (passwordStep && !passwordStep.classList.contains('hidden')) {
        const email = displayedEmail.textContent; // Get email from displayed text
        const password = passwordInput.value;

        if (!password) {
            alert('Please enter your password.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.token);
                // Redirect to main page
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    }
};

// Add event listeners for login form/button
if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
}
if (continueButton) {
     continueButton.addEventListener('click', handleLoginContinue);
}


// Handle Edit Email Button (Login)
if (editEmailButton) {
    editEmailButton.addEventListener('click', (e) => {
        e.preventDefault();
        passwordStep.classList.add('hidden');
        emailStep.classList.remove('hidden');
        authTitle.textContent = 'Welcome back';
        continueButton.textContent = 'Continue';
        emailInput.value = displayedEmail.textContent; // Put the email back into the input
    });
}

// Toggle between email and phone login (Login Page)
if (phoneLoginButton && emailLoginButton && emailStep && phoneStep && passwordStep && socialLoginDiv) {
    phoneLoginButton.addEventListener('click', () => {
        emailStep.classList.add('hidden');
        passwordStep.classList.add('hidden'); // Hide password step
        phoneStep.classList.remove('hidden');
        phoneLoginButton.classList.add('hidden');
        emailLoginButton.classList.remove('hidden');
        // Don't hide other social buttons
        // socialLoginDiv.querySelectorAll('.social-button:not(.phone-login-button):not(.email-login-button)').forEach(button => button.classList.add('hidden'));
        authTitle.textContent = 'Welcome back'; // Keep or change title as needed
        continueButton.textContent = 'Continue'; // Button text for phone login

         // Set initial value of phone input
         if (loginCountryCodeSelect && loginPhoneNumberInput) {
             const selectedCode = loginCountryCodeSelect.value;
             loginPhoneNumberInput.value = selectedCode + ' ';
         }
    });

    emailLoginButton.addEventListener('click', () => {
        phoneStep.classList.add('hidden');
        emailStep.classList.remove('hidden');
        emailLoginButton.classList.add('hidden');
        phoneLoginButton.classList.remove('hidden');
        // Don't show other social buttons, they were never hidden
        // socialLoginDiv.querySelectorAll('.social-button:not(.phone-login-button):not(.email-login-button)').forEach(button => button.classList.remove('hidden'));
        authTitle.textContent = 'Welcome back'; // Keep or change title as needed
        continueButton.textContent = 'Continue'; // Button text for email login
    });
}

// --- Input Validation and Formatting --- //

// Restrict phone number input to only numerical values and handle country code prefix
const handlePhoneNumberInput = (event, countryCodeSelect) => {
    const input = event.target;
    const selectedCode = countryCodeSelect.value;
    const prefix = selectedCode + ' ';

    // Ensure the input starts with the correct prefix
    if (!input.value.startsWith(prefix)) {
        input.value = prefix;
    }

    // Restrict characters after the prefix to only numbers
    const valueAfterPrefix = input.value.substring(prefix.length);
    const numericValueAfterPrefix = valueAfterPrefix.replace(/[^0-9]/g, '');
    input.value = prefix + numericValueAfterPrefix;

    // Prevent cursor from moving into the prefix
    if (input.selectionStart < prefix.length) {
        input.selectionStart = input.selectionEnd = prefix.length;
    }
};

// Add input event listener for login phone number
if (loginPhoneNumberInput && loginCountryCodeSelect) {
    loginPhoneNumberInput.addEventListener('input', (event) => {
        handlePhoneNumberInput(event, loginCountryCodeSelect);
    });
}

// Add input event listener for registration phone number
if (registerPhoneNumberInput && registerCountryCodeSelect) {
     registerPhoneNumberInput.addEventListener('input', (event) => {
        handlePhoneNumberInput(event, registerCountryCodeSelect);
    });
}


// Update phone number placeholder and value based on selected country code
if (loginCountryCodeSelect && loginPhoneNumberInput) {
    loginCountryCodeSelect.addEventListener('change', (event) => {
        const selectedCode = event.target.value;
        const prefix = selectedCode + ' ';
        loginPhoneNumberInput.placeholder = prefix; // Update placeholder
        loginPhoneNumberInput.value = prefix; // Set initial value
        loginPhoneNumberInput.focus(); // Focus the input after changing country
    });

     // Set initial value on page load or when switching to phone view
     const initialLoginCode = loginCountryCodeSelect.value;
     loginPhoneNumberInput.value = initialLoginCode + ' ';
}

if (registerCountryCodeSelect && registerPhoneNumberInput) {
     registerCountryCodeSelect.addEventListener('change', (event) => {
        const selectedCode = event.target.value;
        const prefix = selectedCode + ' ';
        registerPhoneNumberInput.placeholder = prefix; // Update placeholder
        registerPhoneNumberInput.value = prefix; // Set initial value
        registerPhoneNumberInput.focus(); // Focus the input after changing country
    });

    // Set initial value on page load or when switching to phone view
    const initialRegisterCode = registerCountryCodeSelect.value;
    registerPhoneNumberInput.value = initialRegisterCode + ' ';
}


// Toggle Password Visibility (Handles both login and registration, assuming single toggle element)
if (passwordToggle) {
    passwordToggle.addEventListener('click', () => {
        // Determine which password input is visible and toggle its type
        let currentPasswordInput = null;
        if (passwordInput && passwordStep && !passwordStep.classList.contains('hidden')) {
            currentPasswordInput = passwordInput;
        } else if (registerPasswordInput && registrationStep && !registrationStep.classList.contains('hidden')) {
            currentPasswordInput = registerPasswordInput;
        } else if (registerConfirmPasswordInput && registrationStep && !registrationStep.classList.contains('hidden')) {
             currentPasswordInput = registerConfirmPasswordInput;
        }

        if (currentPasswordInput) {
            const type = currentPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            currentPasswordInput.setAttribute('type', type);
            // Toggle eye icon class
            passwordToggle.classList.toggle('bx-hide');
            passwordToggle.classList.toggle('bx-show');
        }
    });
}

// --- Registration Page Logic --- //

// Handle Registration Continue button click
const handleRegistrationContinue = async (e) => {
     e.preventDefault();

    if (registerEmailStep && !registerEmailStep.classList.contains('hidden')) {
        // Currently in email step, proceed to registration details step
        const email = registerEmailInput.value;

        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        registerEmailStep.classList.add('hidden');
        registrationStep.classList.remove('hidden');
        displayedRegisterEmail.textContent = email;
        authTitle.textContent = 'Create Account'; 
        registerContinueButton.textContent = 'Register'; 

    } else if (registerPhoneStep && !registerPhoneStep.classList.contains('hidden')) {
        const countryCode = document.getElementById('register-country-code').value;
        const phoneNumber = document.getElementById('register-phone-number').value;

        // Remove the country code and leading space from the entered number
        const phoneNumberOnly = phoneNumber.replace(countryCode + ' ', '');

        if (!phoneNumberOnly) {
            alert('Please enter your phone number.');
            return;
        }


         // For now, let's just log the phone number
        console.log('Registration Phone number entered:', countryCode + phoneNumberOnly);

    } else if (registrationStep && !registrationStep.classList.contains('hidden')) {
         handleRegistrationSubmit(e); 
    }
};

// Handle Registration Form Submission (for registration details step)
const handleRegistrationSubmit = async (e) => {
     e.preventDefault();

     // Ensure this is only handled when the registration step is visible
     if (registrationStep && !registrationStep.classList.contains('hidden')) {
        const email = displayedRegisterEmail.textContent; 
        const password = registerPasswordInput.value;
        const confirmPassword = registerConfirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.token);
                // Redirect to main page
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Registration failed: ' + (data.message || ''));
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration');
        }
    }
};

// Add event listeners for registration form/button
if (registerForm) {
     registerForm.addEventListener('submit', handleRegistrationSubmit);
}
if (registerContinueButton) {
     registerContinueButton.addEventListener('click', handleRegistrationContinue);
}

// Handle Edit Email Button (Registration)
if (editRegisterEmailButton) {
    editRegisterEmailButton.addEventListener('click', (e) => {
        e.preventDefault();
        registrationStep.classList.add('hidden');
        registerEmailStep.classList.remove('hidden');
        authTitle.textContent = 'Create Account';
        registerContinueButton.textContent = 'Continue';
        registerEmailInput.value = displayedRegisterEmail.textContent; 
    });
}

// Toggle between email and phone login (Registration Page)
if (registerPhoneButton && registerEmailButton && registerEmailStep && registerPhoneStep && registrationStep && socialLoginDiv) {
     registerPhoneButton.addEventListener('click', () => {
        registerEmailStep.classList.add('hidden');
        registrationStep.classList.add('hidden'); 
        registerPhoneStep.classList.remove('hidden');
        registerPhoneButton.classList.add('hidden');
        registerEmailButton.classList.remove('hidden');
         authTitle.textContent = 'Create Account'; 
        registerContinueButton.textContent = 'Continue';

         // Set initial value of phone input
         if (registerCountryCodeSelect && registerPhoneNumberInput) {
             const selectedCode = registerCountryCodeSelect.value;
             registerPhoneNumberInput.value = selectedCode + ' ';
         }
    });

    registerEmailButton.addEventListener('click', () => {
        registerPhoneStep.classList.add('hidden');
        registerEmailStep.classList.remove('hidden');
        registerEmailButton.classList.add('hidden');
        registerPhoneButton.classList.remove('hidden');
        authTitle.textContent = 'Create Account'; 
        registerContinueButton.textContent = 'Continue'; 
    });
}

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    
    // If no token and not already on an auth page
    if (!token && !currentPath.includes('login.html') && !currentPath.includes('register.html')) {
        // Redirect to login page
        window.location.href = 'login.html';
    }
    
    // If has token and on an auth page, redirect to main page
    if (token && (currentPath.includes('login.html') || currentPath.includes('register.html'))) {
        window.location.href = 'index.html';
    }
}

// Run auth check on page load
checkAuth();


// Add click handlers for social login buttons
if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => {
        window.location.href = 'https://accounts.google.com/signin';
    });
}

if (githubLoginButton) {
    githubLoginButton.addEventListener('click', () => {
        window.location.href = 'https://github.com/login/oauth/authorize'; 
    });
}

if (appleLoginButton) {
    appleLoginButton.addEventListener('click', () => {
        window.location.href = 'https://appleid.apple.com/sign-in';
    });
} 
