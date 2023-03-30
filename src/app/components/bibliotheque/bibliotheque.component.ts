import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { NgForm } from '@angular/forms';
import { Books } from 'src/app/models/books';

@Component({
  selector: 'app-bibliotheque',
  template: `
    <div class="p-4 text-center">
      <h1 class="text-3xl font-bold mb-4">Voici la liste de tous les documents</h1>
      <a href="/add-book" class="mt-4 bg-[#D9C8B7] text-white font-bold py-2 px-4 rounded"> Ajouter un document </a>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        <div *ngFor="let book of books">
          <div class="bg-white rounded-lg overflow-hidden shadow-md">
            <img class="w-full h-48 object-cover" src="http://127.0.0.1:8090/api/files/84kfuz5dbicjtt1/{{book?.id}}/{{book?.image}}" alt="image du livre" *ngIf="book?.image">
            <img class="w-full h-48 object-cover" src="assets/images/book.png" alt="image du livre" *ngIf="!book?.image">
            <div class="p-6">
              <h1 class="text-2xl font-bold mb-4">{{ book.title }}</h1>
              <p class="text-gray-700 font-bold mb-2">{{book?.liked_by?.length}} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg></p>
              <p class="text-gray-700 font-bold mb-2">Publié le : {{ book.created | date:'dd/MM/yyyy' }}</p>
              <a class="text-gray-700 font-bold mb-2" href="/profile/{{book.user?.id}}">Par : {{ book.user?.firstname}} {{ book.user?.lastname }}</a>
              <div class="mx-auto">
              <div class="mt-4 mb-6">
                <a *ngFor="let category of book.category_id" class="border-2 border-gray-300 rounded-full py-1 px-3 text-gray-700 font-bold mb-2 mr-2 mt-2">{{ category }}</a>
              </div>
              </div>
              <a href="/book/{{book.id}}" class="mt-4 bg-[#D9C8B7] text-white font-bold py-2 px-4 rounded"> Voir le document </a>
            </div>
          </div>
        </div>
      </div>
    
      `,
  styles: []
})
export class BibliothequeComponent {

  pages: any;
  books: Books[] = [];

  constructor(private databaseService: DatabaseService) {
    this.databaseService.getBooks().then((data) => {
      console.log(data);
      this.books = data;

      for (let i = 0; i < this.books.length; i++) {
        for (let j = 0; j < this.books[i].category_id!.length; j++) {
          this.databaseService.getCategoryById(this.books[i].category_id![j]).then((data) => {
            this.books[i].category_id![j] = data.label as string;
          }
          ).catch(err => {
            console.log(err);
          }
          );
        } 

        this.databaseService.getUserById(this.books[i].user_id).then((data) => {
          this.books[i].user = data;
        }
        ).catch(err => {
          console.log(err);
        }
        );
      }
    }
    ).catch(err => {
      console.log(err);
    });
  }
}
