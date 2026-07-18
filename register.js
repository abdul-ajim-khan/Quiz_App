const form = document.getElementById("registerForm");

const fullName = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const inputs = document.querySelectorAll("input");
const togglePassword = document.querySelectorAll(".toggle-password");

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

function validatePassword(password) {
  return password.length >= 6;
}

togglePassword.forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.target);

    if (input.type === "password") {
      input.type = "text";

      icon.classList.remove("ri-eye-line");
      icon.classList.add("ri-eye-off-line");
    } else {
      input.type = "password";

      icon.classList.remove("ri-eye-off-line");
      icon.classList.add("ri-eye-line");
    }
  });
});

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      showSuccess(input);
    } else {
      clearError(input);
    }
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;

  if (fullName.value.trim() === "") {
    showError(fullName, "Please enter your full name (min 2 chars).");

    valid = false;
  } else {
    showSuccess(fullName);
  }

  if (email.value.trim() === "") {
    showError(email, "Please enter a valid email address.");

    valid = false;
  } else if (!validateEmail(email.value.trim())) {
    showError(email, "Please enter a valid email address.");

    valid = false;
  } else {
    showSuccess(email);
  }

  if (password.value === "") {
    showError(password, "Password must be at least 6 characters.");

    valid = false;
  } else if (!validatePassword(password.value)) {
    showError(password, "Password must be at least 6 characters.");

    valid = false;
  } else {
    showSuccess(password);
  }

  if (confirmPassword.value === "") {
    showError(confirmPassword, "Please confirm your password.");

    valid = false;
  } else if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "Passwords do not match.");

    valid = false;
  } else {
    showSuccess(confirmPassword);
  }

  if (valid) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === email.value.trim().toLowerCase(),
    );

    if (emailExists) {
      showError(email, "This email is already registered.");

      return;
    }
    const newUser = {
      id: Date.now(),

      fullName: fullName.value.trim(),

      email: email.value.trim().toLowerCase(),

      password: password.value,

      //   createdAt: new Date().toISOString(),
    };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("🎉 Registration Successful!");

    form.reset();

    inputs.forEach((input) => {
      input.classList.remove("input-success", "input-error");

      input
        .closest(".input-group")
        .querySelector(".error-message").textContent = "";
    });
    window.location.href = "login.html";
  }
});
const users = JSON.parse(localStorage.getItem("users"));

console.log(users);
