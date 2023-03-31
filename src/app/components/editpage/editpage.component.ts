import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Books } from '../../models/books';
import { Pages } from '../../models/pages';
import { Users } from '../../models/users';
import { Categories } from 'src/app/models/categories';

@Component({
  selector: 'app-editpage',
  template: `
    <div class="py-8" *ngIf="page && book">
      <h1 class="text-3xl font-bold text-center">Modifier la page {{page.title}}</h1>
      <div class="container mx-auto mt-8">
        <div class="flex flex-col justify-center items-center">
          <div class="w-full lg:w-1/2">
            <form (ngSubmit)="editPage(editPageForm)" #editPageForm="ngForm">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
                  Titre de la page
                </label>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Titre de la page"
                  [(ngModel)]="page.title"
                  name="title"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="content">
                  Contenu de la page
                </label>
                <textarea
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="content"
                  type="text"
                  placeholder="Contenu de la page"
                  [(ngModel)]="page.content"
                  name="content"
                  required
                ></textarea>
              </div>
              <div class="mb-4">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Modifier la page
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <h1 class="text-3xl font-bold text-center">Modifier le livre {{book.title}}</h1>
      <div class="container mx-auto mt-8">
        <div class="flex flex-col justify-center items-center">
          <div class="w-full lg:w-1/2">
            <form (ngSubmit)="editBook(editBookForm)" #editBookForm="ngForm">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
                  Titre du livre
                </label>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Titre du livre"
                  [(ngModel)]="book.title"
                  name="title"
                  required
                />
                <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                  Description du livre
                </label>
                <textarea
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="resume"
                  type="text"
                  placeholder="Description du livre"
                  [(ngModel)]="book.resume"
                  name="resume"
                  required
                ></textarea>
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
                <label for="avatar" class="text-gray-700 font-bold mb-2">Image (optionnel)</label>
                <br>
                <input (change)="onFileChange($event)" type="file" id="fileUpload" name="image" type="file" name="avatar" id="avatar" accept="image/*" class="mt-1">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Modifier le livre
                </button>
              </div>
              <!--error message-->
              <p class="text-red-500">{{error}} </p>
            </form>
          </div>
        </div>
      </div>
    </div>
            
  `,
  styles: []
})
export class EditpageComponent {
  constructor(private route: ActivatedRoute, private databaseService: DatabaseService) {
    this.route.params.subscribe(params => {
      this.pageId = params['id'];
    });

    this.databaseService.getPageById(this.pageId).then((page) => {
      this.page = page;
      this.databaseService.getBookById(this.page?.book_id).then((book) => {
        this.book = book;

        this.databaseService.checkAuth().then(record => {
          if (record == false) {
            window.location.href = '/';
          }
        }
        ).catch(err => {
          console.log(err);
        });

        this.databaseService.getUser().then((user) => {
          this.user = user;
          if (this.user?.id != this.book?.user_id || this.user?.role != 'admin') {
            window.location.href = '/';
          }
        }
        ).catch(err => {
          console.log(err);
        }
        );


      }
      ).catch(err => {
        console.log(err);
      }
      );
    }
    ).catch(err => {
      console.log(err);
    }
    );

    this.databaseService.getCategories().then((categories) => {
      this.categories = categories;
    }
    ).catch(err => {
      console.log(err);
    });
  }

  pageId: string | undefined;
  page: Pages | undefined;
  bookId: string | undefined;
  book: Books | undefined;
  user: Users | undefined;
  categories: Categories[] = [];
  selectedCategories: string[] = [];
  files: any[] = [];
  error: string | undefined;

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

  editPage(editPageForm: NgForm) {
    this.databaseService.editPage(this.pageId, editPageForm).then(() => {
      window.location.href = '/book/' + this.page?.book_id;
    }
    ).catch(err => {
      console.log(err);
    }
    );
  }

  editBook(editBookForm: NgForm) {
    if (editBookForm.value.title == '' || editBookForm.value.resume == '') {
      this.error = 'Veuillez remplir tous les champs';
    }
    else if (this.files[0] && this.files[0].size > 5242880) {
      this.error = 'L\'image ne doit pas dépasser 5Mo';
    }
    else if (this.files[0] && (this.files[0].type != 'image/jpeg' && this.files[0].type != 'image/png' && this.files[0].type != 'image/jpg')) {
      this.error = 'L\'image doit être au format jpg, jpeg ou png';
    }
    else {
      editBookForm.value.categories = this.selectedCategories;
      if (this.files[0]) {
        editBookForm.value.image = this.files[0];
      }
      this.databaseService.editBook(this.book?.id, editBookForm).then(() => {
        window.location.href = '/book/' + this.book?.id;
      }
      ).catch(err => {
        console.log(err);
      }
      );
    }
  }
}
