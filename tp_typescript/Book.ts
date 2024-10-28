export enum Status {
    Read = "Read",
    ReRead = "Re-read",
    DNF = "DNF",
    CurrentlyReading = "Currently reading",
    ReturnedUnread = "Returned Unread",
    WantToRead = "Want to read"
}

export enum Format {
    Print = "Print",
    PDF = "PDF",
    Ebook = "Ebook",
    AudioBook = "AudioBook"
}

export default class Book {
    title: string;
    author: string;
    pages: number;
    status: Status;
    price: number;
    pagesRead: number;
    format: Format;
    suggestedBy: string;
    finished: boolean;

    constructor(title: string, author: string, pages: number, status: Status, price: number, pagesRead: number, format: Format, suggestedBy: string) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
        this.price = price;
        this.pagesRead = pagesRead;
        this.finished = pagesRead >= pages;
        this.format = format;
        this.suggestedBy = suggestedBy;
    }

    currentlyAt(): string {
        return `${((this.pagesRead / this.pages) * 100).toFixed(2)}%`;
    }

    updatePagesRead(pages: number): void {
        this.pagesRead = pages;
        this.finished = this.pagesRead >= this.pages;
    }
}
