const form = document.getElementById("loginForm");

const email = document.getElementById("email");
const password = document.getElementById("password");

const inputs = document.querySelectorAll("input");
const togglePassword = document.querySelector(".toggle-password");

function showError(input, message) {
  const group = input.closest(".input-group");

  const error = group.querySelector(".error-message");

  input.classList.add("input-error");
  input.classList.remove("input-success");

  error.textContent = message;
  error.style.display = "block";
}

function showSuccess(input) {
  const group = input.closest(".input-group");

  const error = group.querySelector(".error-message");

  input.classList.remove("input-error");
  input.classList.add("input-success");

  error.textContent = "";
}

function clearError(input) {
  const group = input.closest(".input-group");

  const error = group.querySelector(".error-message");

  input.classList.remove("input-error");

  error.textContent = "";
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

togglePassword.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";

    togglePassword.classList.remove("ri-eye-line");
    togglePassword.classList.add("ri-eye-off-line");
  } else {
    password.type = "password";

    togglePassword.classList.remove("ri-eye-off-line");
    togglePassword.classList.add("ri-eye-line");
  }
});

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim() === "") {
      clearError(input);
    } else {
      showSuccess(input);
    }
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;

  if (email.value.trim() === "") {
    showError(email, "Please enter your email.");

    valid = false;
  } else if (!validateEmail(email.value.trim())) {
    showError(email, "Please enter a valid email.");

    valid = false;
  } else {
    showSuccess(email);
  }

  if (password.value.trim() === "") {
    showError(password, "Please enter your password.");

    valid = false;
  } else {
    showSuccess(password);
  }

  if (!valid) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const currentUser = users.find(
    (user) =>
      user.email === email.value.trim().toLowerCase() &&
      user.password === password.value,
  );

  if (!currentUser) {
    showError(password, "Invalid email or password.");

    return;
  }

  localStorage.setItem(
    "currentUser",

    JSON.stringify(currentUser),
  );

  window.location.href = "index.html";
});
