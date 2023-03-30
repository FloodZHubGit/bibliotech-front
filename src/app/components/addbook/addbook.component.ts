import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatabaseService } from '../../database.service';
import { Categories } from '../../models/categories';

@Component({
  selector: 'app-addbook',
  template: `
      <div class="py-8">
      <h1 class="text-3xl font-bold text-center">Ajouter un document</h1>
      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <form #addBookForm="ngForm" (ngSubmit)="addBook(addBookForm)" class="flex flex-col">
          <div class="mb-4">
            <label for="title" class="text-gray-700 font-bold mb-2">Titre</label>
            <input type="text" name="title" id="title" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" required ngModel>
          </div>
          <div class="mb-4">
            <label for="resume" class="text-gray-700 font-bold mb-2">Résumé</label>
            <input type="text" name="resume" id="resume" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-[#D9C8B7] focus:border-[#D9C8B7] sm:text-sm" ngModel required>
          </div>
          <div class="mb-4">
            <label for="avatar" class="text-gray-700 font-bold mb-2">Image (optionnel)</label>
            <br>
            <input (change)="onFileChange($event)" type="file" id="fileUpload" name="image" type="file" name="avatar" id="avatar" accept="image/*" class="mt-1">
          </div>
          <div class="mb-4">
            <label for="category" class="text-gray-700 font-bold mb-2">Catégories</label>
            <div class="flex flex-wrap items-start">
              <ng-container *ngFor="let category of categories">
                <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-2">
                  <label class="inline-flex items-center">
                    <input type="checkbox" name="category" value="{{ category.id }}" (change)="onCategoryChange($event)" class="form-checkbox h-5 w-5 text-gray-600">
                    <span class="ml-2 text-gray-700">{{ category.label }}</span>
                  </label>
                </div>
              </ng-container>
            </div>
          </div>
          <div>
            <button type="submit" class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline">Publier</button>
          </div>
        </form>
        <p class="text-red-500">{{error}} </p>
      </div>
    </div>
  `,
  styles: []
})
export class AddbookComponent {
  constructor(private databaseService: DatabaseService) {
    this.databaseService.checkAuth().then(record => {
      if (record == false) {
        window.location.href = '/';
      }
    }
    ).catch(err => {
      console.log(err);
    }
    );

    this.databaseService.getCategories().then(record => {
      this.categories = record;
    }
    ).catch(err => {
      console.log(err);
    }
    );
  }

  categories: Categories[] = [];
  selectedCategories: string[] = [];
  files: any[] = [];

  onFileChange(event : any) {
    this.files = event.target.files;
    console.log(event);
  }

  onCategoryChange(event: any) {
    if (event.target.checked) {
      this.selectedCategories.push(event.target.value);
    }
    else {
      this.selectedCategories = this.selectedCategories.filter(item => item !== event.target.value);
    }
    console.log(this.selectedCategories);
  }

  error: string = '';

  addBook(addBookForm: NgForm) {
    if (addBookForm.value.title == '' || addBookForm.value.resume == '') {
      this.error = 'Veuillez remplir tous les champs';
    }
    else if (this.files[0] && this.files[0].size > 5242880) {
      this.error = 'L\'image ne doit pas dépasser 5Mo';
    }
    else if (this.files[0] && (this.files[0].type != 'image/jpeg' && this.files[0].type != 'image/png' && this.files[0].type != 'image/jpg')) {
      this.error = 'L\'image doit être au format jpg, jpeg ou png';
    }
    else {
      addBookForm.value.categories = this.selectedCategories;
      if (this.files[0]) {
        addBookForm.value.image = this.files[0];
      }
      console.log(addBookForm.value);
      this.databaseService.addBook(addBookForm).then(record => {
        window.location.href = '/bibliotheque';
      }
      ).catch(err => {
        console.log(err);
      }
      );
    }
  }
}
