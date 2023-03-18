import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-register',
  template: `
  <!--center on the page -->
    <div class="py-8">
      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <form #registerForm="ngForm" (ngSubmit)="register(registerForm)" class="flex flex-col">
          <div class="mb-4">
            <label for="email" class="text-gray-700 font-bold mb-2">Email</label>
            <input type="email" name="email" id="email" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" required ngModel>
          </div>
          <div class="mb-4">
            <label for="firstName" class="text-gray-700 font-bold mb-2">Prénom</label>
            <input type="text" name="firstName" id="firstName" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" ngModel required>
          </div>
          <div class="mb-4">
            <label for="lastName" class="text-gray-700 font-bold mb-2">Nom</label>
            <input type="text" name="lastName" id="lastName" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" ngModel required>
          </div>
          <div class="mb-4">
            <label for="password" class="text-gray-700 font-bold mb-2">Mot de passe</label>
            <input type="password" name="password" id="password" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" ngModel required>
          </div>
          <div class="mb-4">
            <label for="avatar" class="text-gray-700 font-bold mb-2">Avatar (optionnel)</label>
            <br>
            <input (change)="onFileChange($event)" type="file" id="fileUpload" name="image" class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none">
          </div>
          <div>
            <button type="submit" class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline">S'inscrire</button>
          </div>
        </form>
        <p class="text-red-500">{{error}} </p>
      </div>
    </div>
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
