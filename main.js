const STORAGE_KEY = "BOOKSHELF_APPS";
let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
refreshPage();

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function refreshPage() {
  const inCompletedList = document.getElementById("incompleteBookshelfList");
  inCompletedList.innerHTML = "";
  const completedList = document.getElementById("completeBookshelfList");
  completedList.innerHTML = "";
  books.forEach((book) => {
    createdBooks(book.id, book.title, book.author, book.year, book.isComplete);
  });
}

// data
function saveBook() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  document.dispatchEvent(new Event("ondatasaved"));
}

function addBook() {
  const bookId = +new Date();
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYearString = document.getElementById("inputBookYear").value;
  const bookYear = parseInt(bookYearString);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  if (!bookTitle || !bookAuthor || !bookYear) {
    alert("Please enter both title and author.");
    return;
  }

  const book = {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: isComplete,
  };

  books.push(book);
  saveBook();
  createdBooks(bookId, bookTitle, bookAuthor, bookYear, isComplete);
}

function loadDataFromStorage() {
  const loadData = localStorage.getItem(STORAGE_KEY);

  const data = JSON.parse(loadData);
  if (data) {
    data.forEach((book) =>
      createdBooks(book.id, book.title, book.author, book.year, book.isComplete)
    );
  }
}

function updateBook(e) {
  const id = e.target.id.split("-")[0];
  books = books.map((book) =>
    book.id == id ? { ...book, isComplete: !book.isComplete } : book
  );
  saveBook();
  refreshPage();
  console.log(books);
}

function createdBooks(bookId, bookTitle, bookAuthor, bookYear, isComplete) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  const bookElement = document.createElement("article");
  bookElement.classList.add("book_item");
  bookElement.id = bookId;

  const title = document.createElement("h3");
  title.innerText = bookTitle;

  const author = document.createElement("p");
  author.innerHTML = `Penulis: <span>${bookAuthor}</span>`;

  const year = document.createElement("p");
  year.innerHTML = `Tahun: <span>${bookYear}</span>`;

  const buttons = document.createElement("div");
  buttons.classList.add("button");

  const inCompletedButton = createUncompletedButton(bookId);
  const completedButton = createCompletedButton(bookId);
  const trashButton = createTrashButton(bookId);

  buttons.appendChild(isComplete ? inCompletedButton : completedButton);
  buttons.appendChild(trashButton);

  bookElement.appendChild(title);
  bookElement.appendChild(author);
  bookElement.appendChild(year);
  bookElement.appendChild(buttons);

  console.log(isComplete);
  if (isComplete) {
    buttons.classList.add("completed");
    completeBookshelfList.appendChild(bookElement);
  } else {
    buttons.classList.add("uncompleted");
    incompleteBookshelfList.appendChild(bookElement);
  }
}

inputBookIsComplete.addEventListener("change", function () {
  bookSubmit.innerHTML =
    "Masukkan Buku ke rak <span>" +
    (this.checked ? "Selesai dibaca" : "Belum selesai dibaca") +
    "</span>";
});

function createTrashButton(id) {
  const trashButton = document.createElement("button");
  trashButton.innerText = "Hapus";
  trashButton.classList.add("red");
  trashButton.id = id + "-hapus";
  trashButton.addEventListener("click", removeBook);
  return trashButton;
}

function removeBook(e) {
  const id = e.target.id.split("-")[0];

  books = books.filter((book) => book.id != id);
  saveBook();
  refreshPage();
}

function createUncompletedButton(id) {
  const uncompletedButton = document.createElement("button");
  uncompletedButton.innerText = "Belum selesai di baca";
  uncompletedButton.classList.add("green");
  uncompletedButton.id = id + "-update";
  uncompletedButton.addEventListener("click", updateBook);
  return uncompletedButton;
}

function createCompletedButton(id) {
  const completedButton = document.createElement("button");
  completedButton.innerText = "Sudah selesai di baca";
  completedButton.classList.add("green");
  completedButton.id = id + "-update";
  completedButton.addEventListener("click", updateBook);
  return completedButton;
}

const searchBook = document.getElementById("searchBook");
searchBook.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchInput = document.getElementById("searchBookTitle").value;
  const inCompletedList = document.getElementById("incompleteBookshelfList");
  inCompletedList.innerHTML = "";
  const completedList = document.getElementById("completeBookshelfList");
  completedList.innerHTML = "";

  if (searchInput.length === 0) {
    books.forEach((book) => {
      createdBooks(
        book.id,
        book.title,
        book.author,
        book.year,
        book.isComplete
      );
    });
  } else {
    const filterBooks = books.filter((book) =>
      book.title.includes(searchInput)
    );
    filterBooks.forEach((book) => {
      createdBooks(
        book.id,
        book.title,
        book.author,
        book.year,
        book.isComplete
      );
    });
  }
});

const submitHandler = document.getElementById("inputBook");
submitHandler.addEventListener("submit", function (event) {
  event.preventDefault();
  addBook();
});
