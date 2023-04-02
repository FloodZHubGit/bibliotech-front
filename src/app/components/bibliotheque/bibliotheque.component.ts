import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { NgForm } from '@angular/forms';
import { Books } from 'src/app/models/books';
import { Users } from 'src/app/models/users';
import { Categories } from 'src/app/models/categories';

@Component({
  selector: 'app-bibliotheque',
  template: `
    <div class="p-4 text-center">
      <h1 class="text-3xl font-bold mb-4">Mes documents favoris</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        <div *ngFor="let book of favoriteBooks">
          <div class="bg-white rounded-lg overflow-hidden shadow-md" *ngIf="book.liked_by?.includes(user?.id || '')">
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


      <h1 class="text-3xl font-bold mb-4">Liste de tous les documents</h1>
      <a href="/add-book" class="mt-4 bg-[#D9C8B7] text-white font-bold py-2 px-4 rounded"> Ajouter un document </a>
      <div class="flex justify-center mt-4">
      <div class="relative inline-block text-left">
        <div>
          <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" id="options-menu" aria-haspopup="true" aria-expanded="true" (click)="openSort = !openSort">
            Trier par {{ sortedBy }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" *ngIf="!openSort" style="margin-left: 0.5rem; width: 1rem; height: 1.5rem;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" *ngIf="openSort" style="margin-left: 0.5rem; width: 1rem; height: 1.5rem;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>

          </button>
        </div>
        <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="options-menu" *ngIf="openSort">
          <div class="py-1" role="none">
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" (click)="orderByTitle()">Titre</a>
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" (click)="orderByLikes()">Likes</a>
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" (click)="orderByNewest()">Les plus récents</a>
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" (click)="orderByOldest()">Les plus anciens</a>
          </div>
        </div>
      </div>

      <div class="relative inline-block text-left">
        <div>
          <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" id="options-menu" aria-haspopup="true" aria-expanded="true" (click)="openCategory = !openCategory">
            Catégorie : {{ categorySelected | titlecase }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" *ngIf="!openCategory" style="margin-left: 0.5rem; width: 1rem; height: 1.5rem;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" *ngIf="openCategory" style="margin-left: 0.5rem; width: 1rem; height: 1.5rem;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>

          </button>
        </div>
        <div class="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="options-menu" *ngIf="openCategory">
          <div class="py-1" role="none">
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" (click)="filterByCategoryAll()">Toutes les catégories</a>
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" *ngFor="let category of categories" (click)="filterByCategory(category)">{{ category.label }}</a>
          </div>
        </div>
      </div>







      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        <div *ngFor="let book of filteredBooks">
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
  filteredBooks: Books[] = [];
  favoriteBooks: Books[] = [];
  user: Users | undefined;
  categories: Categories[] = [];
  openSort = false;
  openCategory = false;
  sortedBy = "";
  categorySelected = "";

  constructor(private databaseService: DatabaseService) {
    this.databaseService.getUser().then((data) => {
      this.user = data;
    }
    ).catch(err => {
      console.log(err);
    });

    this.databaseService.getCategories().then((data) => {
      this.categories = data;
    }
    ).catch(err => {
      console.log(err);
    });

    this.databaseService.getBooks().then((data) => {
      this.books = data;
      this.filteredBooks = this.books;

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

      this.favoriteBooks = this.books.filter(book => book.liked_by?.includes(this.user?.id as string));

    }
    ).catch(err => {
      console.log(err);
    });
  }

  orderByNewest() {
    this.sortedBy = "les plus récents";
    this.filteredBooks?.sort((a, b) => {
      if (a.created > b.created) {
        return -1;
      }
      if (a.created < b.created) {
        return 1;
      }
      return 0;
    });
  }

  orderByOldest() {
    this.sortedBy = "les plus anciens";
    this.filteredBooks?.sort((a, b) => {
      if (a.created < b.created) {
        return -1;
      }
      if (a.created > b.created) {
        return 1;
      }
      return 0;
    });
  }

  orderByTitle() {
    this.sortedBy = "par titre";
    this.filteredBooks?.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
  }

  orderByLikes() {
    this.sortedBy = "par popularité";
    this.filteredBooks?.sort((a, b) => {
      if (a.liked_by?.length > b.liked_by?.length) {
        return -1;
      }
      if (a.liked_by?.length < b.liked_by?.length) {
        return 1;
      }
      return 0;
    });
  }

  filterByCategory(category: Categories) {
    this.categorySelected = category.label as string;
    this.filteredBooks = this.books;
    this.filteredBooks = this.books.filter(book => book.category_id?.includes(category.label as string));
  }

  filterByCategoryAll() {
    this.categorySelected = "";
    this.filteredBooks = this.books;
  }
}
