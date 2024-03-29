import { Component, Inject } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Books } from '../../models/books';
import { Pages } from '../../models/pages';
import { Users } from '../../models/users';


@Component({
  selector: 'app-book',
  template: `
  <div class="container mx-auto">
    <div class="flex flex-col justify-center items-center">
      <div class="w-full lg:w-1/2">
        <h1 class="text-3xl font-bold mb-4">{{book?.title}}</h1>
        <p class="text-lg mb-8">{{book?.resume}}</p>
        <button class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white px-4 py-3 rounded font-medium" (click)="like()">
            <span *ngIf="!book?.liked_by?.includes(user?.id || '')">Ajouter aux favoris</span>
            <span *ngIf="book?.liked_by?.includes(user?.id || '')">Retirer des favoris</span>
          </button>
          <button class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white px-4 py-3 rounded font-medium" (click)="afficherPopup()">
            <span>Signaler</span>
          </button>
          <div *ngIf="popupAffiche" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <form #monFormulaire (ngSubmit)="soumettreFormulaire()" class="mt-4">
                <div class="mb-4">
                  <label for="raison" class="block font-medium text-gray-700">Raison :</label>
                  <input type="text" id="raison" name="raison" [(ngModel)]="raison" class="form-input mt-1 block w-full" required>
                </div>

                <div class="mb-4">
                  <label for="description" class="block font-medium text-gray-700">Description :</label>
                  <textarea id="description" name="description" [(ngModel)]="description" class="form-textarea mt-1 block w-full" required></textarea>
                </div>

                <div class="mt-6">
                  <button (click)="fermerPopup()" class="bg-red-500 text-white py-2 px-4 rounded">Annuler</button>
                  <button type="submit" class="bg-[#D9C8B7] hover:bg-[#B8A99B] text-white py-2 px-4 rounded">Envoyer</button>
                </div>
              </form>
            </div>
          </div>
      </div>
      <div class="flex justify-between">
          <button class="px-4 py-2 bg-gray-800 text-white rounded" *ngIf="currentPageIndex > 0" (click)="currentPageIndex = currentPageIndex - 1">Précédent</button>
          <button class="px-4 py-2 bg-gray-800 text-white rounded" *ngIf="currentPageIndex < pages!.length - 1" (click)="currentPageIndex = currentPageIndex + 1">Suivant</button>
        </div>
      <div class="w-full lg:w-1/2">
        <div class="flex flex-row justify-center items-center">
          <h1 class="text-2xl font-bold mb-2" *ngIf="pages?.length == 0">Aucune page dans ce document</h1>
          <h1 class="text-2xl font-bold mb-2" *ngIf="pages!.length > 0">{{pages![currentPageIndex].title}} ({{currentPageIndex + 1}}/{{pages!.length}}) </h1>
          <button class="px-4 py-2 bg-gray-800 text-white rounded ml-4" (click)="editPage()" *ngIf="(user?.role == 'admin' || user?.role == 'author') && pages!.length > 0">Modifier</button>
        </div>
        <p class="text-lg mb-8" *ngIf="pages!.length > 0" [innerHTML]="pages![currentPageIndex].content"></p> 
      </div>
    </div>
  </div>

  <div class="container mx-auto mt-8" *ngIf="user?.role == 'admin' || user?.role == 'author'">
    <div class="flex flex-col justify-center items-center">
      <div class="w-full lg:w-1/2">
        <button class="px-4 py-2 bg-gray-800 text-white rounded" (click)="deletePage()">Supprimer cette page</button>
        <button class="px-4 py-2 bg-gray-800 text-white rounded ml-4" (click)="addPage()">Ajouter une page</button>
        <button class="px-4 py-2 bg-gray-800 text-white rounded ml-4" (click)="deleteBook()">Supprimer ce livre</button>
      </div>
    </div>
  </div>

  `,
  styles: []
})

export class BookComponent {
  constructor(private route: ActivatedRoute, private databaseService: DatabaseService) {

  }
  
  bookId: string | undefined;
  book: Books | undefined;
  pages: Pages[] | undefined;
  currentPageIndex: number = 0;
  user: Users | undefined;
  raison: string | undefined;
  description: string | undefined;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookId = params['id'];
    });

    this.databaseService.getBookById(this.bookId).then((book) => {
      this.book = book;
    }
    ).catch(err => {
      console.log(err);
    }
    );

    this.databaseService.getPagesByBookId(this.bookId).then((pages) => {
      this.pages = pages;
      this.pages.forEach((page) => {
        page.content = page.content?.replace(/\r?\n/g, '<br />');
      }
      );
    }
    ).catch(err => {
      console.log(err);
    }
    );

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
    }
    ).catch(err => {
      console.log(err);
    }
    );
  }

  previousPage() {
    this.currentPageIndex = this.currentPageIndex - 1;
  }

  nextPage() {
    this.currentPageIndex = this.currentPageIndex + 1;
  }

  addPage() {
    this.databaseService.addPageToBook(this.bookId);

    window.location.reload();
    
  }

  deletePage() {
    this.databaseService.deletePage(this.pages![this.currentPageIndex].id);

    window.location.reload();
  }

  editPage() {
    window.location.href = '/edit-page/' + this.pages![this.currentPageIndex].id;
  }

  deleteBook() {
    this.databaseService.deleteBook(this.bookId);
    
    window.location.href = '/bibliotheque';
  }

  like() {
    this.databaseService.likeBook(this.book?.id).then(() => {
      window.location.reload();
    }
    ).catch(err => {
      console.log(err);
    });
  }

  popupAffiche: boolean = false;

  afficherPopup() {
    this.popupAffiche = true;
  }

  fermerPopup() {
    this.popupAffiche = false;
  }

  soumettreFormulaire() {
    console.log("Formulaire soumis avec raison :", this.raison, "et description :", this.description);
    this.databaseService.reportBook(this.book?.id, this.raison, this.description);
    this.popupAffiche = false;
  }
  
}