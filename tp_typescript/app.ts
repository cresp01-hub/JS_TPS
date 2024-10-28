import Book, { Format, Status } from "./Book";


const bookList: Book[] = [];
let totalBooksRead = 0;
let totalPagesRead = 0;

const bookForm = document.getElementById('book-form') as HTMLFormElement;

document.addEventListener("DOMContentLoaded", () => {
    bookForm.addEventListener("submit", async (event: Event) => {
        event.preventDefault(); 

        // Retrieve input values
        const title = (document.getElementById("title") as HTMLInputElement).value;
        const author = (document.getElementById("author") as HTMLInputElement).value;
        const pages = parseInt((document.getElementById("pages") as HTMLInputElement).value);
        const status = (document.getElementById("status") as HTMLSelectElement).value as Status;
        const price = parseFloat((document.getElementById("price") as HTMLInputElement).value);
        const pagesRead = parseInt((document.getElementById("pages-read") as HTMLInputElement).value);
        const format = (document.getElementById("format") as HTMLSelectElement).value as Format;
        const suggestedBy = (document.getElementById("suggested-by") as HTMLInputElement).value;

        // Create a new book object
        const newBook = new Book(title, author, pages, status, price, pagesRead, format, suggestedBy);
        bookList.push(newBook);

        // Sending the POST request to the server
        try {
            const response = await fetch("/api/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newBook)
            });

            if (response.ok) {
                updateBookList();
                bookForm.reset();
                alert("Book added successfully!");
            } else {
                alert("Error adding book.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error.");
        }
    });
});

function updateBookList() {
    const bookListDiv = document.getElementById('book-list') as HTMLDivElement;
    bookListDiv.innerHTML = '';
    bookList.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('p-4', 'bg-white', 'shadow-md', 'rounded');
        bookItem.innerHTML = `
            <h3 class="text-xl font-semibold">${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Status: ${book.status}</p>
            <p>Pages: ${book.pagesRead} / ${book.pages} (${book.currentlyAt()})</p>
            <p>Price: $${book.price.toFixed(2)}</p>
        `;
        bookListDiv.appendChild(bookItem);
    });
}


