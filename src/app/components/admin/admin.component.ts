import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="p-4 text-center">
      <h1 class="text-3xl font-bold mb-4">Bienvenue sur la page d'administration !</h1>
    </div>
      `,
  styles: []
})
export class AdminComponent {
  constructor(private databaseService: DatabaseService) {
    this.databaseService.checkAuth().then(record => {
      if (record == false) {
        window.location.href = '/';
      }
    }
    ).catch(err => {
      console.log(err);
    });

    this.databaseService.getUser().then(record => {
      if(record?.role != 'admin'){
        window.location.href = '/';
      }
    }).catch(err => {
      console.log(err);
    });
  }
}
