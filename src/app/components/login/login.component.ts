import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-login',
  template: `
    <form #loginForm="ngForm" (ngSubmit)="login(loginForm)">
      <div class="mb-4">
        <label for="email" class="sr-only">Email</label>
        <input type="email" name="email" id="email" placeholder="Email" class="bg-gray-100 border-2 w-full p-4 rounded-lg" ngModel>
      </div>
      <div class="mb-4">
        <label for="password" class="sr-only">Password</label>
        <input type="password" name="password" id="password" placeholder="Password" class="bg-gray-100 border-2 w-full p-4 rounded-lg" ngModel>
      </div>
      <div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-3 rounded font-medium w-full">Login</button>
      </div>
    </form>
  `,
  styles: []
})
export class LoginComponent {
  constructor(private databaseService: DatabaseService) {
    this.databaseService.checkAuth().then(record => {
      if (record == true) {
        window.location.href = '/';
      }
    }
    ).catch(err => {
      console.log(err);
    }
    );
  }

  login(loginForm: NgForm) {
    this.databaseService.loginUser(loginForm).then(record => {
      console.log('User logged in:', record);
    }).catch(err => {
      console.log('Error logging in user:', err);
    });

    setTimeout(() => {
      window.location.reload();
    }
    , 1000);
  }
}
