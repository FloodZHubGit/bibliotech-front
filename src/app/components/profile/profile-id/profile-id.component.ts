import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { Books } from 'src/app/models/books';
import { Users } from '../../../models/users';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-profile-id',
  template: `
  <a routerLink="/auteurs" class="text-[#D9C8B7] hover:text-[#B8A99B] font-bold text-sm ml-5">Retour à la liste des auteurs</a>
  <div class="min-h-screen" *ngIf="user">
    <div class="py-8">
      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div class="flex flex-col items-center space-y-4">
          <img class="w-24 h-24 rounded-full object-cover" src="http://127.0.0.1:8090/api/files/_pb_users_auth_/{{user.id}}/{{user.avatar}}" alt="User avatar" *ngIf="user.avatar">
          <img class="w-24 h-24 rounded-full object-cover" src="assets/images/user_icon.png" alt="User avatar" *ngIf="!user?.avatar">
          <h1 class="text-2xl font-bold">{{user.firstname}} {{user.lastname}}</h1>
          <p class="text-gray-500 text-sm">Membre depuis {{user.created | date:'dd/MM/yyyy'}}</p>
          <p class="text-gray-500 text-sm">{{user.followers?.length}} followers</p>
          <div class="flex space-x-4" *ngIf="connectedUser?.id != undefined">
          <button class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white px-4 py-3 rounded font-medium" *ngIf="connectedUser?.id !== user?.id" (click)="follow()">
            <span *ngIf="user.followers?.includes(connectedUser?.id || '')">Ne plus suivre</span>
            <span *ngIf="!user.followers?.includes(connectedUser?.id || '')">Suivre</span>
          </button>
          </div>
          <form #updateForm="ngForm" (ngSubmit)="update(updateForm)" *ngIf="connectedUser?.role === 'admin' || connectedUser?.id === user?.id">
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
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" required ngModel [ngModel]="user.firstname">
            </div>
            <div>
              <label for="lastName" class="text-gray-700 font-bold mb-2">
                Nom
              </label>
              <input type="text" name="lastName" id="lastName" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" required ngModel [ngModel]="user.lastname">
            </div>
            <button type="submit" class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white px-4 py-3 rounded font-medium w-full">
              Sauvegarder les modifications
            </button>
            <button type="button" class="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded font-medium w-full" (click)="deleteConfirmation = true">
              Supprimer ce compte
            </button>
            <div class="flex flex-col space-y-4" *ngIf="deleteConfirmation">
              <p class="text-red-500">Êtes-vous sûr de vouloir supprimer ce compte ?</p>
              <div class="flex flex-row space-x-4">
                <button type="button" class="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded font-medium w-full" (click)="deleteAccount()">
                  Oui
                </button>
                <button type="button" class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white px-4 py-3 rounded font-medium w-full" (click)="deleteConfirmation = false">
                  Non
                </button>
              </div>
            </div>
          </div>
        </form>
        <h2 class="text-2xl font-bold mb-4">Documents</h2>
        <p class="text-gray-500 text-sm mb-4" *ngIf="books?.length == 0">Cet auteur n'a pas encore publié de document.</p>
        <div class="py-8">
          <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-white rounded-lg shadow-md p-4" *ngFor="let book of books">
                <h3 class="text-lg font-medium mb-2">{{book?.title}}</h3>
                <p class="text-gray-500 text-sm mb-4">{{book?.created | date:'dd/MM/yyyy'}}</p>
                <p class="text-gray-500 text-sm mb-4">{{book?.liked_by?.length}} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                </p>

                <a href="/book/{{book.id}}" class="text-blue-500 font-medium hover:underline">Voir le document</a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>

  <div class="min-h-screen" *ngIf="!user">
    <div class="py-8">
      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div class="flex flex-col items-center space-y-4">
          <h1 class="text-2xl font-bold">Ce profil n'existe pas</h1>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: []
})
export class ProfileIdComponent {

  constructor(private route: ActivatedRoute, private databaseService: DatabaseService) { }

  userId: string | undefined;

  user: Users | undefined;

  connectedUser: Users | undefined;

  books: Books[] | undefined;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });

    this.databaseService.getUserById(this.userId).then((user) => {
      this.user = user;
    }
    ).catch(err => {
      this.user = undefined;
    });

    this.databaseService.getBookByUserId(this.userId).then((books) => {
      this.books = books;
    }
    ).catch(err => {
      console.log(err);
    });

    this.databaseService.getUser().then((user) => {
      this.connectedUser = user;
    }
    ).catch(err => {
      console.log(err);
    });
  }

  files: any[] = [];

  onFileChange(event : any) {
    this.files = event.target.files;
    console.log(event);
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
      this.databaseService.updateUserWithId(this.userId, this.user?.username, updateForm).then(() => {
        window.location.reload();
      }
      ).catch(err => {
        console.log(updateForm.value)
        console.log(err);
      });
    }
  }


  deleteConfirmation: boolean = false;

  deleteAccount() {
    if (this.deleteConfirmation) {
      this.databaseService.deleteUserWithId(this.userId).then(() => {
        window.location.href = '/auteurs';
      }
      ).catch(err => {
        console.log('Error deleting user data:', err);
      });
    }
    else {
      this.deleteConfirmation = true;
    }
  }

  follow() {
    this.databaseService.followUser(this.userId).then(() => {
      window.location.reload();
    }
    ).catch(err => {
      console.log(err);
    });
  }
}
