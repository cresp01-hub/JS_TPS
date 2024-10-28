
export const Status = {
    Read: "Read",
    ReRead: "Re-read",
    DNF: "DNF",
    CurrentlyReading: "Currently reading",
    ReturnedUnread: "Returned Unread",
    WantToRead: "Want to read"
};

export const Format = {
    Print: "Print",
    PDF: "PDF",
    Ebook: "Ebook",
    AudioBook: "AudioBook"
};

export default class Book {
    constructor(title, author, pages, status, price, pagesRead, format, suggestedBy) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
        this.price = price;
        this.pagesRead = pagesRead;
        this.finished = this.pagesRead >= this.pages;
    }

    currentlyAt() {
        return `${((this.pagesRead / this.pages) * 100).toFixed(2)}%`;
    }

    updatePagesRead(pages) {
        this.pagesRead = pages;
        if (this.pagesRead >= this.pages) {
            this.finished = true;
        }
    }
}
