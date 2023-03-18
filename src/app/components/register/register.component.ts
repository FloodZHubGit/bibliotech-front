import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-register',
  template: `
    <form #registerForm="ngForm" (ngSubmit)="register(registerForm)">
      <div class="mb-4">
        <label for="email" class="sr-only">Email</label>
        <input type="email" name="email" id="email" placeholder="Email*" class="bg-gray-100 border-2 w-full p-4 rounded-lg" required ngModel>
      </div>
      <div class="mb-4">
        <label for="firstName" class="sr-only">First Name</label>
        <input type="text" name="firstName" id="firstName" placeholder="First Name*" class="bg-gray-100 border-2 w-full p-4 rounded-lg" ngModel required>
      </div>
      <div class="mb-4">
        <label for="lastName" class="sr-only">Last Name</label>
        <input type="text" name="lastName" id="lastName" placeholder="Last Name*" class="bg-gray-100 border-2 w-full p-4 rounded-lg" ngModel required>
      </div>
      <div class="mb-4">
        <label for="password" class="sr-only">Password</label>
        <input type="password" name="password" id="password" placeholder="Password*" class="bg-gray-100 border-2 w-full p-4 rounded-lg" ngModel required>
      </div>
      <div class="mb-4">
        <label for="avatar" class="sr-only">Avatar</label>
        <input (change)="onFileChange($event)" type="file" id="fileUpload" name="image" class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none" placeholder="Titre">
      </div>
      <div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-3 rounded font-medium w-full">Register</button>
      </div>
    </form>

    <p>{{error}}
  `,
  styles: []
})
export class RegisterComponent {
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

  files: any[] = [];

  onFileChange(event : any) {
    this.files = event.target.files;
    console.log(event);
  }

  error: string = '';

  register(registerForm: NgForm) {
    if (registerForm.value.email == '' || registerForm.value.firstName == '' || registerForm.value.lastName == '' || registerForm.value.password == '') {
      this.error = 'Veuillez remplir tous les champs';
    }
    
    else if (this.files[0] && this.files[0].size > 5242880) {
      this.error = 'L\'avatar ne doit pas dépasser 5Mo';
    }
    else if (this.files[0] && (this.files[0].type != 'image/jpeg' && this.files[0].type != 'image/png' && this.files[0].type != 'image/jpg')) {
      this.error = 'L\'avatar doit être au format jpg, jpeg ou png';
    }
    else{
      if (registerForm.value.password.length < 8 || !registerForm.value.password.match(/[A-Z]/) || !registerForm.value.password.match(/[a-z]/) || !registerForm.value.password.match(/[0-9]/)) {
        this.error = 'Le mot de passe doit faire au moins 8 caractères et contenir une majuscule, une minuscule et un chiffre';
      }
      else{
        registerForm.value.role = 'user';
        if (this.files[0]) {
          registerForm.value.avatar = this.files[0];
        }
        this.databaseService.registerUser(registerForm).then(record => {
            window.location.href = '/login';
        }).catch(err => {
          this.error = err;
          console.log(err);
        });
      }
    }
  }
}
