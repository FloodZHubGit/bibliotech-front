import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('http://127.0.0.1:8090');
  }

  async getRecords() {
    let records = await this.pb.collection('tests').getFullList({
      sort: '-created',
    });
    return records;
  }

  async addRecord(data: any) {
    const record = await this.pb.collection('tests').create(data);
    return record;
  }

  async createUser() {
    const data = {
      "username": "test",
      "email": "test@gmail.com",
      "emailVisibility": true,
      "password": "12345678",
      "passwordConfirm": "12345678",
      "firstname": "test",
      "lastname": "test",
      "role": "user"
    };

    const record = await this.pb.collection('users').create(data);
  }

  //login user
  async loginUser() {
    const authData = await this.pb.collection('users').authWithPassword(
      'test@gmail.com',
      '12345678',
    );
  
    // after the above you can also access the auth data from the authStore
    console.log(this.pb.authStore.isValid);
    console.log(this.pb.authStore.token);
    console.log(this.pb.authStore.model?.id);
  }

  async checkAuth() {
    //check if user is authenticated
    if (this.pb.authStore.isValid) {
      return true;
    }
    else {
      return false;
    }
  }

  async logoutUser() {
    await this.pb.authStore.clear();
  }

  async deleteRecord(id: string) {
    await this.pb.collection('tests').delete(id);
  }

  async addImage(data: any) {
    const record = await this.pb.collection('images').create(data);
    return record;
  }

  async getBooks() {
    let records = await this.pb.collection('books').getFullList({
      sort: '-created',
    });
    return records;
  }

  async getPagesForBook() {
    const records = await this.pb.collection('pages').getFullList({
      filter: 'book_id = "cxr9qr33qqi7733"',
    });
    return records;
  }
}