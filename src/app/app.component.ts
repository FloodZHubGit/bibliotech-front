import { Component } from '@angular/core';
import { DatabaseService } from './database.service';

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

    <button (click)="addRecord()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add record</button>

    <h2 class="text-2xl font-bold underline">
      Records
    </h2>
  
    <ul class="list-disc">
      <li *ngFor="let record of records" class="text-xl"> {{record.titre}}       <button (click)="deleteRecord(record)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Delete</button> </li>
    </ul>
  `,
  styles: []
})
export class AppComponent {
  title = 'Bibliotech';
  records: any[] = [];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.databaseService.getRecords().then(records => {
      this.records = records;
      console.log('Records fetched:', records);
    }).catch(err => {
      console.log('Error fetching records:', err);
    });
  }

  addRecord() {
    this.databaseService.addRecord().then(record => {
      console.log('Record created:', record);
      //reload records
      this.databaseService.getRecords().then(records => {
        this.records = records;
        console.log('Records fetched:', records);
      }, err => {
        console.log('Error fetching records:', err);
      }
      );
    }).catch(err => {
      console.log('Error creating record:', err);
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


}