import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { Books } from 'src/app/models/books';
import { Users } from 'src/app/models/users';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('http://127.0.0.1:8090');
  }

  async registerUser(data: any) {

    const authData = new FormData();

    const randomUsername = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    authData.append('username', randomUsername);
    authData.append('email', data.value.email);
    authData.append('emailVisibility', 'false');
    authData.append('password', data.value.password);
    authData.append('passwordConfirm', data.value.password);
    authData.append('firstname', data.value.firstName);
    authData.append('lastname', data.value.lastName);
    authData.append('role', data.value.role);
    if (data.value.avatar) {
      authData.append('avatar', data.value.avatar);
    }

    console.log(authData);

    const record = await this.pb.collection('users').create(authData);
  }

  //login user
  async loginUser(data: any) {
    const authData = await this.pb.collection('users').authWithPassword(
      data.value.email,
      data.value.password
    );
  
    // after the above you can also access the auth data from the authStore
    console.log(this.pb.authStore.isValid);
    console.log(this.pb.authStore.token);
    console.log(this.pb.authStore.model?.id);
  }

  async checkAuth() {
    if (this.pb.authStore.isValid) {
      return true;
    }
    else {
      return false;
    }
  }

  async getUser() { 
    const userData = {
      id: this.pb.authStore.model?.id,
      email: this.pb.authStore.model?.email,
      firstname: this.pb.authStore.model?.['firstname'],
      lastname: this.pb.authStore.model?.['lastname'],
      role: this.pb.authStore.model?.['role'],
      username: this.pb.authStore.model?.['username'],
      avatar: this.pb.authStore.model?.avatar,
      created: this.pb.authStore.model?.created,
      updated: this.pb.authStore.model?.updated,
    }

    return userData;
  }

  async logoutUser() {
    await this.pb.authStore.clear();
  }

  async getBooks() {
    let records = await this.pb.collection('books').getFullList({
      sort: '-created',
    });
    return records;
  }

  async getBooksByConnectedUser() {
    let records: Books[] = [];

    records = await this.pb.collection('books').getFullList({
      sort: '-created',
      where: {
        'user_id': this.pb.authStore.model?.id
      }
    });
    return records;
  }

  async updateUser(data: any) {
    const authData = new FormData();

    authData.append('username', this.pb.authStore.model?.['username']),
    authData.append('firstname', data.value.firstName);
    authData.append('lastname', data.value.lastName);
    authData.append('username', data.value.username);

    if (data.value.avatar) {
      authData.append('avatar', data.value.avatar);
    }

    const record = await this.pb.collection('users').update(this.pb.authStore.model?.id as string, authData);
  }

  async getAllUsers() {
    let records: Users[] = [];

    records = await this.pb.collection('users').getFullList({
    });
    console.log(records);
    return records;
  }
}