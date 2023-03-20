import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Users } from '../models/users';



@Component({
  selector: 'app-auteurs',
  template: `
<div class="min-h-screen">
  <div class="py-8">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-bold text-center mb-8">Liste des auteurs</h1>
      <!--dropdown menu-->
      <div class="relative inline-block text-left">
        <div>
          <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" id="options-menu" aria-haspopup="true" aria-expanded="true" (click)="open = !open">
            Trier par {{sortedBy}}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" *ngIf="!open" style="margin-left: 0.5rem; width: 1rem; height: 1.5rem;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" *ngIf="open" style="margin-left: 0.5rem; width: 1rem; height: 1.5rem;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>

          </button>
        </div>
        <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="options-menu" *ngIf="open">
          <div class="py-1" role="none">
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" (click)="orderByLastname()">Nom</a>
            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" (click)="orderByFirstname()">Prénom</a>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-md p-4" *ngFor="let author of authors">
          <img src="http://127.0.0.1:8090/api/files/_pb_users_auth_/{{author?.id}}/{{author?.avatar}}" alt="Author profile picture" class="w-24 h-24 rounded-full object-cover mx-auto mb-4" *ngIf="author?.avatar">
          <img src="assets/images/user_icon.png" alt="Author profile picture" class="w-24 h-24 rounded-full object-cover mx-auto mb-4" *ngIf="!author?.avatar">
          <h3 class="text-lg font-medium mb-2 text-center">{{author.firstname}} {{author.lastname}}</h3>
          <div class="flex justify-center">
            <a routerLink="/profile/{{author?.id}}" class="text-blue-500 hover:text-blue-600">Voir le profil</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: []
})
export class AuteursComponent {

  constructor(private databaseService: DatabaseService) {

  }

  authors: Users[] | undefined;

  ngOnInit() {
    this.databaseService.getAllUsers().then((users) => {
      this.authors = users;
      console.log(this.authors);
    }
    );
  }

  open = false;

  //string for sorted by
  sortedBy = "";

  orderByFirstname() {
    this.sortedBy = "prénom";
    this.authors?.sort((a, b) => {
      if (a.firstname < b.firstname) {
        return -1;
      }
      if (a.firstname > b.firstname) {
        return 1;
      }
      return 0;
    });
  }

  orderByLastname() {
    this.sortedBy = "nom";
    this.authors?.sort((a, b) => {
      if (a.lastname < b.lastname) {
        return -1;
      }
      if (a.lastname > b.lastname) {
        return 1;
      }
      return 0;
    });
  }

}
