import { Component } from '@angular/core';
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
      </div>
      <div class="flex justify-between">
          <button class="px-4 py-2 bg-gray-800 text-white rounded" *ngIf="currentPageIndex > 0" (click)="currentPageIndex = currentPageIndex - 1">Précédent</button>
          <button class="px-4 py-2 bg-gray-800 text-white rounded" *ngIf="currentPageIndex < pages!.length - 1" (click)="currentPageIndex = currentPageIndex + 1">Suivant</button>
        </div>
      <div class="w-full lg:w-1/2">
        <h1 class="text-2xl font-bold mb-2" *ngIf="pages?.length == 0">Aucune page dans ce document</h1>
        <h1 class="text-2xl font-bold mb-2" *ngIf="pages!.length > 0">{{pages![currentPageIndex].title}} ({{currentPageIndex + 1}}/{{pages!.length}})</h1>
        <p class="text-lg mb-8" *ngIf="pages!.length > 0" [innerHTML]="pages![currentPageIndex].content"></p>
      </div>
    </div>
  </div>

  <div class="container mx-auto" *ngIf="user?.role == 'admin' || user?.role == 'author'">
    <div class="flex flex-col justify-center items-center">
      <div class="w-full lg:w-1/2">
        <h1 class="text-3xl font-bold mb-4">Ajouter une page</h1>
        <button class="px-4 py-2 bg-gray-800 text-white rounded" (click)="addPage()">Ajouter</button>
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
}