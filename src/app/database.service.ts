import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { Books } from 'src/app/models/books';
import { Users } from 'src/app/models/users';
import { Pages } from './models/pages';
import { Categories } from './models/categories';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('http://127.0.0.1:8090');
    this.pb.autoCancellation(false);
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
    let userData: Users | undefined;

    userData = {
      id: this.pb.authStore.model?.id,
      email: this.pb.authStore.model?.email,
      firstname: this.pb.authStore.model?.['firstname'],
      lastname: this.pb.authStore.model?.['lastname'],
      role: this.pb.authStore.model?.['role'],
      username: this.pb.authStore.model?.['username'],
      avatar: this.pb.authStore.model?.avatar,
      followers: this.pb.authStore.model?.['followers'],
      created: this.pb.authStore.model?.created || '',
      updated: this.pb.authStore.model?.updated || '',
    }

    return userData;
  }

  async refreshUser() {
    const authData = await this.pb.collection('users').authRefresh();
  }

  async logoutUser() {
    await this.pb.authStore.clear();
  }

  async getBooks() {
    let records: Books[] = [];

    records = await this.pb.collection('books').getFullList({
      sort: '-created',
    });
    return records;
  }

  async getBooksByConnectedUser() {
    let records: Books[] = [];

    records = await this.pb.collection('books').getFullList({
      sort: '-created',
      filter: `user_id = "${this.pb.authStore.model?.id}"`,
    });
    return records;
  }

  async getBookById(id: string | undefined) {
    let record: Books;
    record = await this.pb.collection('books').getOne(id as string, {
    });
    return record;
  }


  async getBookByUserId(id: string | undefined) {
    let records: Books[] = [];
    records = await this.pb.collection('books').getFullList({
      sort: '-created',
      filter: `user_id = "${id}"`,
  });

    return records;
  }

  async updateUser(data: any) {
    const authData = new FormData();

    authData.append('username', this.pb.authStore.model?.['username']),
    authData.append('firstname', data.value.firstName);
    authData.append('lastname', data.value.lastName);

    if (data.value.avatar) {
      authData.append('avatar', data.value.avatar);
    }

    const record = await this.pb.collection('users').update(this.pb.authStore.model?.id as string, authData);
  }

  async updateUserWithId(id: string | undefined, username: string | undefined, data: any) {
    const authData = new FormData();

    authData.append('username', username as string),
    authData.append('firstname', data.value.firstName);
    authData.append('lastname', data.value.lastName);

    if (data.value.avatar) {
      authData.append('avatar', data.value.avatar);
    }

    const record = await this.pb.collection('users').update(id as string, authData);
  }

  async deleteUser() {
    const record = await this.pb.collection('users').delete(this.pb.authStore.model?.id as string);
  }

  async deleteUserWithId(id: string | undefined) {
    const record = await this.pb.collection('users').delete(id as string);
  }

  async getAllUsers() {
    let records: Users[] = [];

    records = await this.pb.collection('users').getFullList({
    });
    return records;
  }

  async getUserById(id: string | undefined) {
    let record: Users;

    record = await this.pb.collection('users').getOne(id as string, {
    });

    return record;
  }
  
  async followUser(id: string | undefined) {
    let record: Users;

    record = await this.pb.collection('users').getOne(id as string, {
    });

    let followers: string[] = [];
    followers = record.followers as string[];

    if (followers.includes(this.pb.authStore.model?.id as string)) {
      followers = followers.filter((item) => item !== this.pb.authStore.model?.id);
    }
    else {
      followers.push(this.pb.authStore.model?.id as string);
    }

    const record2 = await this.pb.collection('users').update(id as string, {
      followers: followers,
    });
  }

  async getFavoriteAuthors() {
    let records: Users[] = [];

    records = await this.pb.collection('users').getFullList({
      filter: `followers ~ "${this.pb.authStore.model?.id}"`,
    });

    return records;
  }

  async getPages() {
    const records = await this.pb.collection('pages').getFullList({
      sort: '-created',
  });
    return records;
  }

  async addPage(bookId: string | undefined, data: any) {
    const authData = new FormData();

    authData.append('title', data.value.title);
    authData.append('content', data.value.content);
    authData.append('book_id', bookId as string);

    const record = await this.pb.collection('pages').create(authData);
  }

  async requestVerification() {
    await this.pb.collection('users').requestVerification('florentin.dekneudt@gmail.com');
  }

  async getCategories() {
    const records: Categories[] = await this.pb.collection('categories').getFullList({
      sort: '-created',
    });
    return records;
  }

  async addCategory(data: any) {
    const authData = new FormData();

    authData.append('label', data.value.label);

    const record = await this.pb.collection('categories').create(authData);
  }

  async deleteCategory(id: string | undefined) {
    const record = await this.pb.collection('categories').delete(id as string);
  }

  async editCategory(id: string | undefined, data: any) {
    const record = await this.pb.collection('categories').update(id as string, {
      label: data.value.label,
    });
  }

  async getCategoryById(id: string | undefined) {
    const record: Categories = await this.pb.collection('categories').getOne(id as string, {
    });
    return record;
  }
}