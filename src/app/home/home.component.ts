import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <h1 class="text-3xl font-bold underline">
      {{title}}
    </h1>


    <button (click)="createUser()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create user</button>

    <button (click)="loginUser()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login user</button>

    <button (click)="checkAuth()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Check auth</button>

    <button (click)="logout()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Logout</button>

    <button (click)="getBooks()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get books</button>

    <button (click)="getPages()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get pages</button>

    <form #addRecordForm="ngForm" (ngSubmit)="addRecord(addRecordForm)" class="flex flex-col">
      <input type="text" name="titre" class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none" placeholder="Titre" ngModel>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add record</button>
    </form>

    <h2 class="text-2xl font-bold underline">
      Records
    </h2>
  
    <ul class="list-disc">
      <li *ngFor="let record of records" class="text-xl"> {{record.titre}}       <button (click)="deleteRecord(record)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Delete</button> </li>
    </ul>

    <form #addImageForm="ngForm" (ngSubmit)="addImage()" class="flex flex-col">
      <input (change)="onFileChange($event)" type="file" id="fileUpload" name="image" class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none" placeholder="Titre">
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add image</button>
    </form>
  `,
  styles: []
})
export class HomeComponent {
  title = 'Bibliotech';
  records: any[] = [];

  constructor(private databaseService: DatabaseService) {
    
  }

  ngOnInit(): void {
    this.databaseService.getRecords().then(records => {
      this.records = records;
      console.log('Records fetched:', records);
    }).catch(err => {
      console.log('Error fetching records:', err);
    });
  }

  addRecord( form: NgForm ) {
    this.databaseService.addRecord(form.value).then(record => {
      console.log('Record added:', record);
      //reload records
      this.databaseService.getRecords().then(records => {
      this.records = records;
        console.log('Records fetched:', records);
      }, err => {
        console.log('Error fetching records:', err);
      });
    }).catch(err => {
      console.log('Error adding record:', err);
    });
  }

  createUser() {
    this.databaseService.createUser().then(record => {
      console.log('User created:', record);
    }).catch(err => {
      console.log('Error creating user:', err);
    });
  }

  loginUser() {
    this.databaseService.loginUser().then(record => {
      console.log('User logged in:', record);
    }).catch(err => {
      console.log('Error logging in user:', err);
    });

    setTimeout(() => {
      window.location.reload();
    }
    , 1000);
  }

  checkAuth() {
    this.databaseService.checkAuth().then(record => {
      console.log('User checked:', record);
    }).catch(err => {
      console.log('Error checking user:', err);
    });
  }

  logout() {
    this.databaseService.logoutUser();

    setTimeout(() => {
      window.location.reload();
    }
    , 1000);
  }

  deleteRecord(record : any) {
    this.databaseService.deleteRecord(record.id).then(record => {
      console.log('Record deleted:', record);
      //reload records
      this.databaseService.getRecords().then(records => {
        this.records = records;
        console.log('Records fetched:', records);
      }, err => {
        console.log('Error fetching records:', err);
      }
      );
    }).catch(err => {
      console.log('Error deleting record:', err);
    });
  }

  files: any[] = [];

  onFileChange(event : any) {
    this.files = event.target.files;
    console.log(event);
  }

  addImage() {
    const formData = new FormData();
    formData.append('image', this.files[0]);
    this.databaseService.addImage(formData).then(record => {
      console.log('Image added:', record);
    }
    ).catch(err => {
      console.log('Error adding image:', err);
    });
  }

  getBooks() {
    this.databaseService.getBooks().then(record => {
      console.log('Books fetched:', record);
    }
    ).catch(err => {
      console.log('Error fetching books:', err);
    });
  }

  getPages() {
    this.databaseService.getPagesForBook().then(record => {
      console.log('Pages fetched:', record);
    }
    ).catch(err => {
      console.log('Error fetching pages:', err);
    });
  }

}