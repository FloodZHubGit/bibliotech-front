import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-login',
  template: `
  <div class="py-8">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <form #loginForm="ngForm" (ngSubmit)="login(loginForm)">
        <div class="mb-4">
        <label for="email" class="text-gray-700 font-bold mb-2">
          Email
        </label>
          <input type="email" name="email" id="email" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" ngModel required>
        </div>
        <div class="mb-4">
        <label for="password" class="text-gray-700 font-bold mb-2">
          Mot de passe
        </label>
          <input type="password" name="password" id="password" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" ngModel required>
        </div>

        <div>
          <button type="submit" class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white px-4 py-3 rounded font-medium w-full">Se connecter</button>
        </div>
      </form>
      <p class="text-red-500">{{error}} </p>
      <div class="mt-4">
        <button (click)="passwordForgotten = true" class="font-bold">Mot de passe oublié ?</button>

        <div *ngIf="passwordForgotten">
          <p class="text-gray-700 font-bold mb-2 mt-8">
            Veuillez entrer votre adresse email pour réinitialiser votre mot de passe.
          </p>
          <form #passwordForgottenForm="ngForm" (ngSubmit)="forgotPassword(passwordForgottenForm)">
            <div class="mb-4">
              <label for="email" class="text-gray-700 font-bold mb-2">
                Email
              </label>
              <input type="email" name="email" id="email" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                            placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" ngModel required>

              <button type="submit" class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white px-4 py-3 rounded font-medium w-full mt-8">Envoyer</button>
            </div>
          </form>
      </div>
    </div>
  </div>
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
    });
  }

  error: string = '';
  passwordForgotten: boolean = false;



  login(loginForm: NgForm) {
    if (loginForm.value.email == '' || loginForm.value.password == '') {
      this.error = "Veuillez remplir tous les champs";
      return;
    }
    else{
      this.databaseService.loginUser(loginForm).then(record => {
        window.location.href = '/';
      }).catch(err => {
        this.error = "Email ou mot de passe incorrect"
      });
    }
  }

  forgotPassword(passwordForgottenForm: NgForm) {
    this.databaseService.requestPasswordReset(passwordForgottenForm.value.email).then(record => {
      this.error = "Un email de réinitialisation a été envoyé à l'adresse indiquée.";
    }).catch(err => {
      this.error = "Aucun compte n'est associé à cette adresse email";
    });
  }

}
