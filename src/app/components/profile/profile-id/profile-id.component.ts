import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { Books } from 'src/app/models/books';
import { Users } from '../../../models/users';


@Component({
  selector: 'app-profile-id',
  template: `
  <div class="min-h-screen" *ngIf="user">
    <div class="py-8">
      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div class="flex flex-col items-center space-y-4">
          <img class="w-24 h-24 rounded-full object-cover" src="http://127.0.0.1:8090/api/files/_pb_users_auth_/{{user.id}}/{{user.avatar}}" alt="User avatar" *ngIf="user.avatar">
          <img class="w-24 h-24 rounded-full object-cover" src="assets/images/user_icon.png" alt="User avatar" *ngIf="!user?.avatar">
          <h1 class="text-2xl font-bold">{{user.firstname}} {{user.lastname}}</h1>
          <p class="text-gray-500 text-sm">Membre depuis {{user.created | date:'dd/MM/yyyy'}}</p>
        </div>
      </div>

      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-4" *ngFor="let book of books">
            <p class="text-gray-500 text-sm">{{book?.created | date:'dd/MM/yyyy'}}</p>
            <h3 class="text-lg font-medium mb-2">{{book?.title}}</h3>
            <div class="flex justify-center">
              <a routerLink="/book/{{book?.id}}" class="text-blue-500 hover:text-blue-600">Voir le livre</a>
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
  }
}
