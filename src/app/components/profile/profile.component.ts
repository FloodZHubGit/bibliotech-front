import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { Users } from '../../models/users';

import { NgForm } from '@angular/forms';
import { Books } from 'src/app/models/books';


@Component({
  selector: 'app-profile',
  template: `
<div class="min-h-screen">
  <div class="py-8">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="flex flex-col items-center space-y-4">
        <img class="w-24 h-24 rounded-full object-cover" src="http://127.0.0.1:8090/api/files/_pb_users_auth_/{{user?.id}}/{{user?.avatar}}" alt="User avatar" *ngIf="user?.avatar">
        <img class="w-24 h-24 rounded-full object-cover" src="assets/images/user_icon.png" alt="User avatar" *ngIf="!user?.avatar">
        <h1 class="text-2xl font-bold">{{user?.firstname}} {{user?.lastname}}</h1>
        <p class="text-gray-500 text-sm">Membre depuis {{user?.created | date:'dd/MM/yyyy'}}</p>
        <p class="text-gray-500 text-sm" *ngIf="user?.role == 'admin'">Vous êtes un administrateur</p>
        <form #updateForm="ngForm" (ngSubmit)="update(updateForm)">
          <div class="flex flex-col space-y-4">
            <div>
              <label for="avatar" class="text-gray-700 font-bold mb-2">
                Changer l'avatar
              </label>
              <input (change)="onFileChange($event)" type="file" name="avatar" id="avatar" accept="image/*" class="mt-1">
            </div>
            <div>
              <label for="firstName" class="text-gray-700 font-bold mb-2">
                Prénom
              </label>
              <input type="text" name="firstName" id="firstName" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" required ngModel [ngModel]="user?.firstname">
            </div>
            <div>
              <label for="lastName" class="text-gray-700 font-bold mb-2">
                Nom
              </label>
              <input type="text" name="lastName" id="lastName" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" required ngModel [ngModel]="user?.lastname">
            </div>
            <button type="submit" class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white px-4 py-3 rounded font-medium w-full">
              Sauvegarder les modifications
            </button>
          </div>
        </form>
        <p class="text-red-500">{{error}} </p>
        <div class="py-8">
          <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 class="text-2xl font-bold mb-4">Mes documents</h2>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-white rounded-lg shadow-md p-4" *ngFor="let book of books">
                <h3 class="text-lg font-medium mb-2">{{book?.title}}</h3>
                <p class="text-gray-500 text-sm mb-4">{{book?.created | date:'dd/MM/yyyy'}}</p>
                <p class="text-gray-500 text-sm mb-4">{{book?.liked_by?.length}} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                </p>

                <a href="#" class="text-blue-500 font-medium hover:underline">Voir le document</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: []
})
export class ProfileComponent {

  constructor(private databaseService: DatabaseService) {
    this.databaseService.checkAuth().then(record => {
      if (record == false) {
        window.location.href = '/';
      }
    }
    ).catch(err => {
      console.log(err);
    });
  }

  user: Users | undefined;

  books: Books[] | undefined;

  ngOnInit(updateForm: NgForm): void {
    this.databaseService.getUser().then(record => {
      this.user = record;
    }
    ).catch(err => {
      console.log('Error getting user data:', err);
    });

    this.databaseService.getBooksByConnectedUser().then(record => {
      this.books = record;
    }
    ).catch(err => {
      console.log('Error getting user data:', err);
    });
  }

  error: string = '';

  update(updateForm: NgForm) {
    if (updateForm.value.firstName == '' || updateForm.value.lastName == '') {
      this.error = 'Veuillez remplir tous les champs';
    }
    else if (this.files[0] && this.files[0].size > 5242880) {
      this.error = 'L\'avatar ne doit pas dépasser 5Mo';
    }
    else if (this.files[0] && (this.files[0].type != 'image/jpeg' && this.files[0].type != 'image/png' && this.files[0].type != 'image/jpg')) {
      this.error = 'L\'avatar doit être au format jpg, jpeg ou png';
    }
    else {
      if (this.files[0]) {
        updateForm.value.avatar = this.files[0];
      }
      this.databaseService.updateUser(updateForm).then(record => {
        window.location.reload();
      }
      ).catch(err => {
        console.log('Error updating user data:', err);
      });
    }

  }
  
  files: any[] = [];

  onFileChange(event : any) {
    this.files = event.target.files;
    console.log(event);
  }
}
