import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { NgForm } from '@angular/forms';
import { Categories } from 'src/app/models/categories';
import { Reported } from 'src/app/models/reported';
import { Users } from 'src/app/models/users';


@Component({
  selector: 'app-admin',
  template: `
    <div class="p-4 text-center">
      <div class="flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-4">Liste des catégories</h1>
        <div class="flex flex-col items-center">
          <div class="flex flex-row items-center">
            <form #addCategoryForm="ngForm" (ngSubmit)="addCategory(addCategoryForm)" class="flex flex-row items-center">
              <input type="text" name="label" class="border-2 border-[#D9C8B7] rounded-md p-2 mr-4" placeholder="Nom de la catégorie" ngModel required>
              <button type="submit" class="bg-[#D9C8B7] text-white font-bold py-2 px-4 rounded"> Ajouter </button>
            </form>
          </div>
          <div class="flex flex-col items-center mt-4">
          <div class="flex flex-col items-center mt-4" *ngFor="let category of categories">
            <div class="flex flex-row items-center">
            <form #editCategoryForm="ngForm" (ngSubmit)="editCategory(editCategoryForm, category.id)" class="flex flex-row items-center mt-2">
              <input type="text" name="label" class="border-2 border-[#D9C8B7] rounded-md p-2 mr-4 w-36" placeholder="Nouveau nom" [(ngModel)]="category.label" required>
              <button type="submit" class="bg-[#D9C8B7] text-white font-bold py-2 px-4 rounded"> Modifier </button>
            </form>
            <button (click)="deleteCategory(category.id)" class="bg-[#D9C8B7] text-white font-bold py-2 px-4 rounded mt-2 ml-4"> Supprimer </button>
            </div>
          </div>
          </div>
        </div>
      </div>
      <h2 class="text-2xl font-bold mb-4">Liste des signalements</h2>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livre</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signaleur</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raison</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let reported of reports" class="text-left sm:items-center border-b border-gray-200 pb-4">
            <td class="px-6 py-4 whitespace-nowrap">{{ reported.book_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ reported.user_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ reported.reason }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ reported.description }}</td>
          </tr>
        </tbody>
      </table>

    </div>
      `,
  styles: []
})
export class AdminComponent {
  
  reports: Reported[] = [];
  user: Users | undefined;


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

    this.databaseService.getCategories().then(records => {
      this.categories = records;
    }
    ).catch(err => {
      console.log('Erreur dans la récupération des catégories : ', err);
    });

  }

  categories: Categories[] = [];

  requestVerification() {
    this.databaseService.requestVerification().then(records => {
      console.log('Demande de vérification envoyée : ', records);
    }
    ).catch(err => {
      console.log('Erreur dans l\'envoi de la demande de vérification : ', err);
    });
  }

  addCategory(data: NgForm) {
    if(data.value.label == ''){
      return;
    }
    else{
      this.databaseService.addCategory(data).then(record => {
        console.log('Catégorie ajoutée : ', record);
  
        this.databaseService.getCategories().then(records => {
          this.categories = records;
        }
        ).catch(err => {
          console.log('Erreur dans la récupération des catégories : ', err);
        });
      }
      ).catch(err => {
        console.log('Erreur dans l\'ajout de la catégorie : ', err);
      });
    }
  }

  deleteCategory(id: string | undefined) {
    this.databaseService.deleteCategory(id).then(record => {
      console.log('Catégorie supprimée : ', record);

      this.databaseService.getCategories().then(records => {
        this.categories = records;
      }
      ).catch(err => {
        console.log('Erreur dans la récupération des catégories : ', err);
      });
    }
    ).catch(err => {
      console.log('Erreur dans la suppression de la catégorie : ', err);
    });
  }

  editCategory(data: NgForm, id: string | undefined) {
    if(data.value.label == ''){
      return;
    }
    else{
      this.databaseService.editCategory(id, data).then(record => {
        console.log('Catégorie modifiée : ', record);
  
        this.databaseService.getCategories().then(records => {
          this.categories = records;
        }
        ).catch(err => {
          console.log('Erreur dans la récupération des catégories : ', err);
        });
      }
      ).catch(err => {
        console.log('Erreur dans la modification de la catégorie : ', err);
      });
    }
  }

  ngOnInit(){
    this.databaseService.getReports().then(reports => {
      this.reports = reports;

      for (let i = 0; i < this.reports.length; i++) {
        this.databaseService.getUserById(this.reports[i].user_id).then((data) => {
          this.reports[i].user_id = data.email as string;
        }
        ).catch(err => {
          console.log(err);
        }
        );

        this.databaseService.getBookById(this.reports[i].book_id).then((data) => {
          this.reports[i].book_id = data.title as string;
        }
        ).catch(err => {
          console.log(err);
        }
        );
      }

      console.log(reports);
    });
    console.log("records");
  console.log(this.reports);
  }
}
