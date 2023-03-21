import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-root',
  template: `
    <div class="p-4 text-center">
      <h1 class="text-3xl font-bold mb-4">{{ greeting }}</h1>
      <p class="mb-4">Vous pouvez aller voir la <a routerLink="/bibliotheque" class="text-[#B8A99B] hover:underline">bibliothèque</a> ou les <a routerLink="/auteurs" class="text-[#B8A99B] hover:underline">auteurs</a></p>
      <p class="mb-4" *ngIf="!loggedIn">Vous pouvez aussi vous <a routerLink="/login" class="text-[#B8A99B] hover:underline">connecter</a> ou vous <a routerLink="/register" class="text-[#B8A99B] hover:underline">inscrire</a></p>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  constructor(private databaseService: DatabaseService) {
    this.databaseService.checkAuth().then(record => {
      if (record == true) {
        this.loggedIn = true;
      }
    }
    ).catch(err => {
      console.log(err);
    });

    this.databaseService.getUser().then(record => {
      this.user = record;
    }
    ).catch(err => {
      console.log(err);
    });
  }

  get greeting(): string {
    return this.loggedIn ? `Bienvenue sur la Bibliotech ${this.user?.firstname} !` : 'Bienvenue sur la Bibliotech !';
  }

  user: Users | undefined;

  loggedIn: boolean = false;
}