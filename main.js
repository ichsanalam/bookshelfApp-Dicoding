books = []
const BOOKS_KEY = 'books_storage'

document.addEventListener('DOMContentLoaded', function () {
    const formAddBook = document.getElementById('bookForm');
    formAddBook.addEventListener('submit', function (e) {
        e.preventDefault()
        addBook()
        renderBooks()
        formAddBook.reset()
    })

    if (isStorageAvailabe()) {
        loadStorage()
    }
})

function isStorageAvailabe() {
    if (typeof Storage === 'undefined') {
        alert('Maaf, browser anda tidak mempunyai web storage');
        return false;
    } else {
        return true;
    }
}



function addBook() {
    const id = Date.now()
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;

    const book = pushBookToArr(id, title, author, year, false)
    books.push(book)
    saveBooktoStorage()
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
    let incompletedBook = document.getElementById('incompleteBookList')
    incompletedBook.innerHTML = ''
    let completedBook = document.getElementById('completeBookList')
    completedBook.innerHTML = ''
    for (const book of books) {
        // card
        const card = document.createElement('div');
        card.setAttribute('class', 'card-list')
        // div
        const div = document.createElement('div');
        div.setAttribute('data-bookid', 'book.id');
        div.setAttribute('data-testid', 'bookItem');
        // title
        const title = document.createElement('h3');
        title.setAttribute('data-testid', 'bookItemTitle');
        title.textContent = book.title;
        // author
        const author = document.createElement('p');
        author.setAttribute('data-testid', 'bookItemAuthor');
        author.textContent = 'Penulis: ' + book.author;
        // year
        const year = document.createElement('p');
        year.setAttribute('data-testid', 'bookItemYear');
        year.textContent = 'Tahun: ' + book.year;
        // button
        const divButton = document.createElement('div');
        // finish button
        const finishBtn = document.createElement('button');
        finishBtn.setAttribute('data-testid', 'bookItemIsCompleteButton');
        finishBtn.setAttribute('class', 'btn-finish')
        if (book.isComplete == false) {
            finishBtn.textContent = 'Selesai Dibaca';
            finishBtn.addEventListener('click', function(){
                finishRead(book)
            })
        } else {
            finishBtn.textContent = 'Belum Selesai Dibaca';
            finishBtn.addEventListener('click', function(){
                unFinishRead(book)
            }) 
        }
        // finishBtn.addEventListener('click', function(){
        //     finishRead(book)
        // })
        // delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('data-testid', 'bookItemDeleteButton');
        deleteBtn.setAttribute('class', 'btn-delete');
        deleteBtn.textContent = 'Hapus Buku';
        deleteBtn.addEventListener('click', function() {
            deleteBook(book.id)
        })
        // edit button
        const editBtn = document.createElement('button');
        editBtn.setAttribute('data-testid', 'bookItemEditButton');
        editBtn.setAttribute('class', 'btn-edit');
        editBtn.textContent = 'Edit Buku';
        // merge
        divButton.append(finishBtn, deleteBtn, editBtn)

        // add to card
        card.append(div, title, author, year, divButton);

        if (book.isComplete == false) {
            incompletedBook.appendChild(card)
        } else {
            completedBook.appendChild(card)
        }
        
    }
}

function saveBooktoStorage() {
    if (isStorageAvailabe) {
        const arrToJson = JSON.stringify(books)
        localStorage.setItem(BOOKS_KEY, arrToJson)
    }
}

function loadStorage() {
    const load = localStorage.getItem(BOOKS_KEY)
    const data = JSON.parse(load)

    if (data !== null) {
        for (const book of data)
            books.push(book)
    }
    renderBooks()
}

function finishRead(book) {
    book.isComplete = true;
    saveBooktoStorage()
    renderBooks()
}

function unFinishRead(book) {
    book.isComplete = false;
    saveBooktoStorage()
    renderBooks()
}

function deleteBook(bookId) {
    books = books.filter((book) => book.id != bookId)
    saveBooktoStorage()
    renderBooks()
}