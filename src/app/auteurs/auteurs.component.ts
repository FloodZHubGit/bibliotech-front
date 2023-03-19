import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Users } from '../models/users';



@Component({
  selector: 'app-auteurs',
  template: `
<div class="bg-gray-100 min-h-screen">
  <div class="py-8">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-bold text-center mb-8">Liste des auteurs</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-md p-4" *ngFor="let author of authors">
          <img src="http://127.0.0.1:8090/api/files/_pb_users_auth_/{{author?.id}}/{{author?.avatar}}" alt="Author profile picture" class="w-24 h-24 rounded-full object-cover mx-auto mb-4" *ngIf="author?.avatar">
          <img src="assets/images/user_icon.png" alt="Author profile picture" class="w-24 h-24 rounded-full object-cover mx-auto mb-4" *ngIf="!author?.avatar">
          <h3 class="text-lg font-medium mb-2 text-center">{{author.firstname}} {{author.lastname}}</h3>
          <div class="flex justify-center">
            <a href="#" class="text-blue-500 hover:text-blue-600">Voir le profil</a>
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

}
