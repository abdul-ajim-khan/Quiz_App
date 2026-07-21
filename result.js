const users = JSON.parse(localStorage.getItem("users")) || [];

const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

const quizResult = JSON.parse(localStorage.getItem("quizResult")) || {};

const userName = document.getElementById("userName");

const studentName = document.getElementById("studentName");

const percentage = document.getElementById("percentage");

const score = document.getElementById("score");

const correct = document.getElementById("correct");

const wrong = document.getElementById("wrong");

const gradeBadge = document.getElementById("gradeBadge");

const progressCircle = document.getElementById("progressCircle");

const reviewBtn = document.getElementById("reviewBtn");

const retryBtn = document.getElementById("retryBtn");

const reviewContainer = document.getElementById("reviewContainer");

const demoQuestion = JSON.parse(localStorage.getItem("demoQuestion")) || [];
let questions = demoQuestion;

userName.textContent =
  currentUser.fullName.charAt(0).toUpperCase() +
    currentUser.fullName.slice(1) || "User";

studentName.textContent =
  currentUser.fullName.charAt(0).toUpperCase() +
    currentUser.fullName.slice(1) || "User";

const totalQuestions = quizResult.totalQuestions || questions.length;

const correctAnswers = quizResult.correct || 0;

const wrongAnswers = quizResult.incorrect || 0;

const percent = quizResult.percentage || 0;
console.log(correct);
percentage.textContent = percent + "%";

score.textContent = `${correctAnswers}/${totalQuestions}`;

correct.textContent = correctAnswers;

wrong.textContent = wrongAnswers;

const radius = 55;

const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;

progressCircle.style.strokeDashoffset = circumference;

setTimeout(() => {
  const offset = circumference - (percent / 100) * circumference;

  progressCircle.style.strokeDashoffset = offset;
}, 200);

if (percent >= 90) {
  gradeBadge.textContent = "Excellent";

  gradeBadge.style.background = "#DCFCE7";

  gradeBadge.style.color = "#166534";
} else if (percent >= 75) {
  gradeBadge.textContent = "Very Good";

  gradeBadge.style.background = "#DBEAFE";

  gradeBadge.style.color = "#1D4ED8";
} else if (percent >= 50) {
  gradeBadge.textContent = "Good";

  gradeBadge.style.background = "#FEF3C7";

  gradeBadge.style.color = "#92400E";
} else {
  gradeBadge.textContent = "Needs Improvement";

  gradeBadge.style.background = "#FEE2E2";

  gradeBadge.style.color = "#991B1B";
}

const reviewTemplate = document.getElementById("reviewTemplate");
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
questions.forEach((question, index) => {
  const clone = reviewTemplate.content.cloneNode(true);

  const reviewCard = clone.querySelector(".review-card");

  const reviewHeader = clone.querySelector(".review-header");

  const questionTitle = clone.querySelector(".question");

  const reviewBody = clone.querySelector(".review-body");

  const toggleBtn = clone.querySelector(".toggle-btn");

  const optionsContainer = clone.querySelector(".options");

  questionTitle.textContent = `${index + 1}. ${decodeHTML(question.question)}`;

  optionsContainer.innerHTML = "";

  question.options.forEach((option, optionIndex) => {
    const optionBox = document.createElement("div");

    optionBox.className = "review-option";

    const letter = document.createElement("span");

    letter.className = "option-letter";

    letter.textContent = String.fromCharCode(65 + optionIndex);

    const text = document.createElement("span");

    text.className = "option-text";

    text.innerHTML = option
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    optionBox.appendChild(letter);

    optionBox.appendChild(text);

    if (optionIndex === question.answer) {
      optionBox.classList.add("correct");
    }

    if (
      quizResult.answers &&
      quizResult.answers[index] === optionIndex &&
      optionIndex !== question.answer
    ) {
      optionBox.classList.add("wrong");
    }

    optionsContainer.appendChild(optionBox);
  });

  reviewContainer.appendChild(clone);
});

const reviewSection = document.getElementById("reviewSection");

reviewBtn.addEventListener("click", () => {
  reviewSection.classList.toggle("show");

  if (reviewSection.classList.contains("show")) {
    reviewBtn.textContent = "Hide Review";
  } else {
    reviewBtn.textContent = "Review Answers";
  }
});

retryBtn.addEventListener("click", () => {
  const confirmRetry = confirm("Do you want to restart the quiz?");

  if (!confirmRetry) return;

  localStorage.removeItem("quizResult");

  localStorage.removeItem("quizAnswers");
  sessionStorage.removeItem("quizQuestions");
  localStorage.removeItem("demoQuestion");

  localStorage.removeItem("quizTime");

  window.location.href = "quiz.html";
});

const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

history.push({
  user: currentUser.fullName.toUpperCase() || "User",

  score: correctAnswers,

  total: totalQuestions,

  percentage: percent,

  date: new Date().toLocaleString(),
});

localStorage.setItem(
  "quizHistory",

  JSON.stringify(history),
);

if (!quizResult || Object.keys(quizResult).length === 0) {
  alert("No quiz result found.");

  window.location.href = "quiz.html";
}

console.log("Current User :", currentUser);

console.log("Quiz Result :", quizResult);

console.log("Quiz History :", history);
