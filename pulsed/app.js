// ======== pulsED app.js ========

// --- Book Data ---
const books = [
  {
    id: "book1",
    title: "The Writing Revolution",
    author: "Judith C. Hochman & Natalie Wexler",
    cover: "images/book1.jpg",
    summary: "A clear framework for teaching writing across the curriculum using explicit strategies, sentence expansion, and the integration of reading and writing.",
    teachingTips: [
      "Start with simple sentence exercises to build writing fluency.",
      "Embed writing tasks in all subjects, not just English.",
      "Model, scaffold, and provide regular feedback.",
    ],
    quiz: [
      {
        question: "Who are the authors of The Writing Revolution?",
        options: [
          "Judith Hochman & Natalie Wexler",
          "Doug Lemov & Erica Woolway",
          "John Hattie & Dylan Wiliam",
          "Rosenshine & Marzano"
        ],
        answer: 0
      },
      {
        question: "What is a core strategy of The Writing Revolution?",
        options: [
          "Sentence expansion",
          "Silent reading only",
          "Summative assessment focus",
          "Group projects"
        ],
        answer: 0
      }
    ]
  },
  {
    id: "book2",
    title: "Making Every Lesson Count",
    author: "Shaun Allison & Andy Tharby",
    cover: "images/book2.jpg",
    summary: "Distils evidence-based teaching into six principles: challenge, explanation, modelling, practice, feedback, and questioning.",
    teachingTips: [
      "Pitch work just above students’ comfort levels to promote challenge.",
      "Use questioning to assess and develop thinking.",
      "Make explanations clear and link to prior learning.",
    ],
    quiz: [
      {
        question: "Which is NOT one of the six principles in 'Making Every Lesson Count'?",
        options: [
          "Challenge",
          "Explanation",
          "Practice",
          "Play"
        ],
        answer: 3
      },
      {
        question: "Who is a co-author of 'Making Every Lesson Count'?",
        options: [
          "Andy Tharby",
          "Dylan Wiliam",
          "John Hattie",
          "Doug Lemov"
        ],
        answer: 0
      }
    ]
  },
  // Add more books here...
];

// --- Helper to get query params ---
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// --- Render Homepage ---
function renderBookList() {
  const bookList = document.getElementById('book-list');
  if (!bookList) return;

  bookList.innerHTML = books.map(book => `
    <div class="book-card">
      <img src="${book.cover}" alt="Book cover for ${book.title}" class="book-cover"/>
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author}</div>
      <button onclick="goToBook('${book.id}')">View Details</button>
    </div>
  `).join('');
}

function goToBook(bookId) {
  window.location.href = `book.html?book=${bookId}`;
}

// --- Render Book Details ---
function renderBookDetail() {
  const container = document.getElementById('book-detail');
  if (!container) return;

  const bookId = getQueryParam('book');
  const book = books.find(b => b.id === bookId);

  if (book) {
    container.innerHTML = `
      <section class="detail-section">
        <img src="${book.cover}" alt="Book cover for ${book.title}" class="book-cover"/>
        <h2>${book.title}</h2>
        <div class="book-author">by ${book.author}</div>
        <div class="book-summary">${book.summary}</div>
        <div class="teaching-tips">
          <strong>Teaching Tips:</strong>
          <ul>
            ${book.teachingTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
        <button onclick="startQuiz('${book.id}')">Take Quiz</button>
      </section>
    `;
  } else {
    container.innerHTML = "<p>Book not found.</p>";
  }
}

// --- Quiz Logic ---
function startQuiz(bookId) {
  window.location.href = `quiz.html?book=${bookId}`;
}

function renderQuiz() {
  const container = document.getElementById('quiz-section');
  if (!container) return;

  const bookId = getQueryParam('book');
  const book = books.find(b => b.id === bookId);

  if (book && book.quiz) {
    let quizIndex = 0;
    let score = 0;

    function renderQuizQuestion() {
      const q = book.quiz[quizIndex];
      container.innerHTML = `
        <section class="quiz-section">
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options">
            ${q.options.map((opt, i) => `<button onclick="checkQuizAnswer(${i})">${opt}</button>`).join('')}
          </div>
          <div id="quiz-feedback" class="quiz-feedback"></div>
        </section>
      `;
    }

    window.checkQuizAnswer = function(selected) {
      const q = book.quiz[quizIndex];
      const correct = selected === q.answer;
      const feedback = document.getElementById('quiz-feedback');

      feedback.className = `quiz-feedback ${correct ? 'correct' : 'incorrect'}`;
      feedback.textContent = correct ? "Correct!" : `Incorrect. The answer is: ${q.options[q.answer]}`;
      score += correct ? 1 : 0;

      setTimeout(() => {
        quizIndex++;
        if (quizIndex < book.quiz.length) {
          renderQuizQuestion();
        } else {
          renderQuizResults();
        }
      }, 1300);
    };

    function renderQuizResults() {
      container.innerHTML = `
        <section class="quiz-section">
          <h2>Quiz Complete!</h2>
          <div>Your score: <strong>${score}/${book.quiz.length}</strong></div>
          <button class="next-btn" onclick="window.location.href='book.html?book=${bookId}'">Back to Book</button>
          <button class="next-btn" onclick="window.location.href='index.html'">Home</button>
        </section>
      `;
    }

    renderQuizQuestion();
  } else {
    container.innerHTML = "<p>Quiz not found.</p>";
  }
}

// --- Initialize on page load ---
document.addEventListener("DOMContentLoaded", () => {
  renderBookList();
  renderBookDetail();
  renderQuiz();
});
