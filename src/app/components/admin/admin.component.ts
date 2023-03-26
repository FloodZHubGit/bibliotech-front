import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { NgForm } from '@angular/forms';
import { Categories } from 'src/app/models/categories';


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

      <button (click)="requestVerification()" class="mt-4 bg-[#D9C8B7] text-white font-bold py-2 px-4 rounded"> Demander une vérification </button>
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
}
