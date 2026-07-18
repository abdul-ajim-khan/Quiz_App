const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  alert("Please login first.");

  window.location.href = "login.html";
}

document.getElementById("userName").textContent = currentUser.fullName;

const questionText = document.getElementById("question");

const optionsContainer = document.getElementById("options");

const questionCount = document.getElementById("questionCount");

const answeredCount = document.getElementById("answeredCount");

const totalQuestions = document.getElementById("totalQuestions");

const progressBar = document.getElementById("progressBar");

const navigatorBox = document.getElementById("navigator");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

const submitBtn = document.getElementById("submitBtn");

const timer = document.getElementById("timer");

const timerBox = document.getElementById("timerBox");

let currentQuestion = 0;

let userAnswers = new Array(questions.length).fill(null);

let timeLeft = 600;

totalQuestions.textContent = questions.length;

function loadQuestion() {
  const question = questions[currentQuestion];

  questionCount.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

  questionText.textContent = question.question;

  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");

    optionDiv.className = "option";

    if (userAnswers[currentQuestion] === index) {
      optionDiv.classList.add("active");
    }

    optionDiv.innerHTML = `

            <div class="option-letter">

                ${optionLetters[index]}

            </div>

    <div class="option-text">
        ${option
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}
    </div>

        `;

    optionDiv.addEventListener("click", () => {
      selectOption(index);
    });

    optionsContainer.appendChild(optionDiv);
  });

  updateNavigator();

  updateProgress();

  updateButtons();
}

function selectOption(index) {
  userAnswers[currentQuestion] = index;

  loadQuestion();
}

function updateProgress() {
  const answered = userAnswers.filter((answer) => answer !== null).length;

  answeredCount.textContent = answered;

  const percentage = ((currentQuestion + 1) / questions.length) * 100;

  progressBar.style.width = percentage + "%";
}

function updateNavigator() {
  navigatorBox.innerHTML = "";

  questions.forEach((question, index) => {
    const button = document.createElement("button");

    button.className = "nav-btn";

    button.textContent = index + 1;

    if (index === currentQuestion) {
      button.classList.add("active");
    } else if (userAnswers[index] !== null) {
      button.classList.add("answered");
    }

    button.addEventListener("click", () => {
      currentQuestion = index;

      loadQuestion();
    });

    navigatorBox.appendChild(button);
  });
}

function updateButtons() {
  prevBtn.disabled = currentQuestion === 0;

  if (currentQuestion === questions.length - 1) {
    nextBtn.style.display = "none";

    submitBtn.style.display = "flex";
  } else {
    nextBtn.style.display = "flex";

    submitBtn.style.display = "none";
  }
}

loadQuestion();

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;

    loadQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;

    loadQuestion();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    if (currentQuestion > 0) {
      currentQuestion--;

      loadQuestion();
    }
  }

  if (event.key === "ArrowRight") {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;

      loadQuestion();
    }
  }
});

function startTimer() {
  const interval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);

    let seconds = timeLeft % 60;

    minutes = String(minutes).padStart(2, "0");

    seconds = String(seconds).padStart(2, "0");

    timer.textContent = `${minutes}:${seconds}`;

    if (timeLeft <= 60) {
      timerBox.classList.add("danger");
    }

    if (timeLeft <= 0) {
      clearInterval(interval);

      submitQuiz();

      return;
    }

    timeLeft--;
  }, 1000);
}

function saveProgress() {
  localStorage.setItem(
    "quizAnswers",

    JSON.stringify(userAnswers),
  );

  localStorage.setItem(
    "currentQuestion",

    currentQuestion,
  );

  localStorage.setItem(
    "remainingTime",

    timeLeft,
  );
}

function restoreProgress() {
  const savedAnswers = JSON.parse(localStorage.getItem("quizAnswers"));

  const savedQuestion = localStorage.getItem("currentQuestion");

  const savedTime = localStorage.getItem("remainingTime");

  if (savedAnswers) {
    userAnswers = savedAnswers;
  }

  if (savedQuestion !== null) {
    currentQuestion = Number(savedQuestion);
  }

  if (savedTime !== null) {
    timeLeft = Number(savedTime);
  }

  loadQuestion();
}

restoreProgress();

const interval = setInterval(() => {
  saveProgress();
}, 1000);

startTimer();

submitBtn.addEventListener("click", () => {
  const confirmSubmit = confirm("Are you sure you want to submit the quiz?");

  if (confirmSubmit) {
    submitQuiz();
  }
});

function submitQuiz() {
  clearInterval(interval);

  let correct = 0;

  let incorrect = 0;

  let skipped = 0;

  const review = [];

  questions.forEach((question, index) => {
    const selected = userAnswers[index];

    if (selected === null) {
      skipped++;
    } else if (selected === question.answer) {
      correct++;
    } else {
      incorrect++;
    }

    review.push({
      questionNumber: index + 1,

      question: question.question,

      options: `${question.options}`,

      selectedAnswer: selected,

      correctAnswer: question.answer,

      isCorrect: selected === question.answer,
    });
  });

  const totalQuestions = questions.length;

  const score = correct;

  const percentage = Math.round((score / totalQuestions) * 100);

  let grade = "";

  if (percentage >= 90) {
    grade = "A+";
  } else if (percentage >= 80) {
    grade = "A";
  } else if (percentage >= 70) {
    grade = "B";
  } else if (percentage >= 60) {
    grade = "C";
  } else if (percentage >= 50) {
    grade = "D";
  } else {
    grade = "F";
  }

  const result = {
    user: currentUser.fullName,

    email: currentUser.email,

    totalQuestions,

    score,

    correct,

    incorrect,

    skipped,

    percentage,

    grade,

    review,

    submittedAt: new Date().toLocaleString(),
  };

  localStorage.setItem(
    "quizResult",

    JSON.stringify(result),
  );

  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

  history.push(result);

  localStorage.setItem(
    "quizHistory",

    JSON.stringify(history),
  );

  localStorage.removeItem("quizAnswers");

  localStorage.removeItem("currentQuestion");

  localStorage.removeItem("remainingTime");

  window.location.href = "result.html";
}
