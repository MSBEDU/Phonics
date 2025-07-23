let books = [];
let activeFilters = [];

// Load books
async function loadBooks() {
  const res = await fetch('books.json');
  books = await res.json();
  renderFilters();
  renderBookList();
  renderBookDetail();
}

// Render filters
function renderFilters() {
  const filterContainer = document.getElementById('filter-bar');
  if (!filterContainer) return;

  const allGenres = [...new Set(books.flatMap(book => book.genres))];
  filterContainer.innerHTML = `
    ${allGenres.map(g => `
      <button class="filter-btn ${activeFilters.includes(g) ? 'active' : ''}" onclick="toggleFilter('${g}')">${g}</button>
    `).join('')}
    <button class="clear-btn" onclick="clearFilters()">Clear Filters</button>
  `;
}

function toggleFilter(genre) {
  if (activeFilters.includes(genre)) {
    activeFilters = activeFilters.filter(g => g !== genre);
  } else {
    activeFilters.push(genre);
  }
  renderFilters();
  renderBookList();
}

function clearFilters() {
  activeFilters = [];
  renderFilters();
  renderBookList();
}

// Render homepage
function renderBookList() {
  const bookList = document.getElementById('book-list');
  if (!bookList) return;

  let filtered = books;
  if (activeFilters.length > 0) {
    filtered = books.filter(book => activeFilters.some(f => book.genres.includes(f)));
  }

  bookList.innerHTML = filtered.map(book => `
    <div class="book-card">
      <img src="images/${book.imageName}.jpg" alt="Book cover for ${book.title}" class="book-cover"/>
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author}</div>
      <div class="book-rating">${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</div>
      <div class="book-genres">${book.genres.map(g => `<span class="genre">${g}</span>`).join('')}</div>
      <p class="book-summary">${book.description}</p>
      <button onclick="goToBook('${book.id}')">View Details</button>
    </div>
  `).join('');
}

function goToBook(bookId) {
  window.location.href = `book.html?book=${bookId}`;
}

// Render book detail page
function renderBookDetail() {
  const container = document.getElementById('book-detail');
  if (!container) return;

  const bookId = new URLSearchParams(window.location.search).get('book');
  const book = books.find(b => b.id === bookId);

  if (!book) {
    container.innerHTML = "<p>Book not found.</p>";
    return;
  }

  container.innerHTML = `
    <section class="detail-section">
      <img src="images/${book.imageName}.jpg" alt="Cover of ${book.title}" class="book-cover"/>
      <h2>${book.title}</h2>
      <div class="book-author">by ${book.author}</div>
      <div class="book-genres">${book.genres.map(g => `<span class="genre">${g}</span>`).join('')}</div>
      <div class="book-rating">${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</div>
      <p class="book-summary">${book.description}</p>
      <a href="${book.buyLink}" target="_blank" class="buy-btn">Buy this book</a>
      <div class="book-content">
        ${book.content.map(item => item.type === 'text'
          ? `<div class="content-section"><h3>${item.title}</h3><p>${item.content}</p></div>`
          : `<div class="quiz-inline">
               <h3>${item.title}</h3>
               <p>${item.question.text}</p>
               ${item.question.options.map(opt => `
                 <button onclick="checkInlineAnswer('${item.id}','${opt}','${item.question.correctAnswer}')">${opt}</button>
               `).join('')}
               <div id="quiz-feedback-${item.id}" class="quiz-feedback"></div>
             </div>`
        ).join('')}
      </div>
    </section>
  `;
}

// Quiz feedback
function checkInlineAnswer(questionId, selected, correct) {
  const feedback = document.getElementById(`quiz-feedback-${questionId}`);
  feedback.textContent = selected === correct ? "Correct!" : `Incorrect. Correct answer: ${correct}`;
  feedback.className = selected === correct ? "quiz-feedback correct" : "quiz-feedback incorrect";
}

// Init
document.addEventListener("DOMContentLoaded", loadBooks);
