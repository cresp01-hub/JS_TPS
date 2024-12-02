import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Book } from './shared/Book';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'tp-angular';
  books:Book[]=[
    new Book(1, 'Angular for Beginners', true),
    new Book(2, 'Tuto TypeScript', true),
    new Book(3, 'Learn JS', false)
  ];

  toggleReadStatus(book: Book) {
    book.isRead = !book.isRead;
}}


