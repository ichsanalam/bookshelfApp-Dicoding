books = [];
const BOOKS_KEY = "books_storage";
let editingBook = null;

document.addEventListener("DOMContentLoaded", function () {
    const formAddBook = document.getElementById("bookForm");
    formAddBook.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
        renderBooks();
        formAddBook.reset();
    });
    //   cek storage
    if (isStorageAvailabe()) {
        loadStorage();
    }
    //   modals edit
    const modal = document.getElementById("editModal");
    const closeModal = document.querySelector(".close");
    const editForm = document.getElementById("editForm");

    // Close modal when clicking the close button
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle edit form submission
    editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // Update book details
        editingBook.title = document.getElementById("editTitle").value;
        editingBook.author = document.getElementById("editAuthor").value;
        editingBook.year = document.getElementById("editYear").value;
        saveBooktoStorage();
        renderBooks();
        // Close modal
        modal.style.display = "none";
    });

    // search feature
    const formSearch = document.getElementById('searchBook');
    formSearch.addEventListener('submit', function(e) {
        e.preventDefault();
        searchBook()
    })
});

function isStorageAvailabe() {
    if (typeof Storage === "undefined") {
        alert("Maaf, browser anda tidak mempunyai web storage");
        return false;
    } else {
        return true;
    }
}

function addBook() {
    const id = Number(new Date());
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const buttonCheck = document.getElementById('bookFormIsComplete').checked

    const book = pushBookToArr(id, title, author, year, buttonCheck);
    books.push(book);
    saveBooktoStorage();
}

function pushBookToArr(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
}

function renderBooks() {
    let incompletedBook = document.getElementById("incompleteBookList");
    incompletedBook.innerHTML = "";
    let completedBook = document.getElementById("completeBookList");
    completedBook.innerHTML = "";
    for (const book of books) {
        // card
        // const card = document.createElement("div");
        // card.setAttribute("class", "card-list");
        // card list
        const card = document.createElement("div");
        card.setAttribute("class", "card-list");
        card.setAttribute("data-bookid", book.id);
        card.setAttribute("data-testid", "bookItem");
        // title
        const title = document.createElement("h3");
        title.setAttribute("data-testid", "bookItemTitle");
        title.textContent = book.title;
        // author
        const author = document.createElement("p");
        author.setAttribute("data-testid", "bookItemAuthor");
        author.textContent = "Penulis: " + book.author;
        // year
        const year = document.createElement("p");
        year.setAttribute("data-testid", "bookItemYear");
        year.textContent = "Tahun: " + book.year;
        // button
        const divButton = document.createElement("div");
        // finish button
        const finishBtn = document.createElement("button");
        finishBtn.setAttribute("data-testid", "bookItemIsCompleteButton");
        finishBtn.setAttribute("class", "btn-finish");
        if (book.isComplete == false) {
            finishBtn.textContent = "Selesai Dibaca";
            finishBtn.addEventListener("click", function () {
                finishRead(book);
            });
        } else {
            finishBtn.textContent = "Belum Selesai Dibaca";
            finishBtn.addEventListener("click", function () {
                unFinishRead(book);
            });
        }
        // delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");
        deleteBtn.setAttribute("class", "btn-delete");
        deleteBtn.textContent = "Hapus Buku";
        deleteBtn.addEventListener("click", function () {
            deleteBook(book.id);
        });
        // edit button
        const editBtn = document.createElement("button");
        editBtn.setAttribute("data-testid", "bookItemEditButton");
        editBtn.setAttribute("class", "btn-edit");
        editBtn.textContent = "Edit Buku";
        editBtn.addEventListener("click", function () {
            editBook(book);
        });
        // merge
        divButton.append(finishBtn, deleteBtn, editBtn);

        // add to card
        card.append(title, author, year, divButton);

        if (book.isComplete == false) {
            incompletedBook.appendChild(card);
        } else {
            completedBook.appendChild(card);
        }
    }
}

function saveBooktoStorage() {
    if (isStorageAvailabe) {
        const arrToJson = JSON.stringify(books);
        localStorage.setItem(BOOKS_KEY, arrToJson);
    }
}

function loadStorage() {
    const load = localStorage.getItem(BOOKS_KEY);
    const data = JSON.parse(load);

    if (data !== null) {
        for (const book of data) books.push(book);
    }
    renderBooks();
}

function finishRead(book) {
    book.isComplete = true;
    saveBooktoStorage();
    renderBooks();
}

function unFinishRead(book) {
    book.isComplete = false;
    saveBooktoStorage();
    renderBooks();
}

function deleteBook(bookId) {
    books = books.filter((book) => book.id != bookId);
    saveBooktoStorage();
    renderBooks();
}

function editBook(book) {
    editingBook = book;

    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;
    document.getElementById('editYear').value = book.year;

    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
}

function searchBook() {
    const search = document.getElementById('searchBookTitle').value.toLowerCase();
    const filterBook = books.filter(book => book.title.toLowerCase().includes(search))

    const bookCard = document.querySelectorAll("[data-testid='bookItem']");
    for (const book of bookCard) {
        const bookId = parseInt(book.getAttribute('data-bookid'));
        const result = filterBook.some(b => b.id === bookId);
        console.log(result);
        if (result) {
            book.removeAttribute('hidden')
        } else {
            book.setAttribute('hidden', true)
        }
    }
}