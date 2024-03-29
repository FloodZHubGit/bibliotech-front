import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-layout',
  template: `
<nav class="bg-[#D9C8B7]">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <!-- Mobile menu button-->
        <button type="button" class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#B8A99B] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false" (click)="menuOpen = !menuOpen">
          <span class="sr-only">Open main menu</span>
          <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          -->
          <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          -->
          <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex flex-shrink-0 items-center">
          <!-- find logo in assets folder -->
          <img routerLink="/" class="block h-8 w-auto lg:hidden" src="assets/images/logo.png" alt="Workflow" alt="Bibliotech">
          <img routerLink="/" class="hidden h-8 w-auto lg:block" src="assets/images/logo.png" alt="Bibliotech">
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">

            <a routerLink="/bibliotheque" class="hover:bg-[#B8A99B] text-white rounded-md px-3 py-2 text-md font-medium">Bibliothèque</a>

            <a routerLink="/auteurs" class="hover:bg-[#B8A99B] text-white rounded-md px-3 py-2 text-md font-medium">Auteurs</a>

            <a routerLink="/admin" class="hover:bg-[#B8A99B] text-white rounded-md px-3 py-2 text-md font-medium" *ngIf="user?.role == 'admin'">Admin</a>

          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

        <!--if user is not logged in-->
        <div *ngIf="!loggedIn">
          <a routerLink="/login" class="hover:bg-[#B8A99B] text-white rounded-md px-3 py-2 text-md font-medium">Connexion</a>
          <a routerLink="/register" class="hover:bg-[#B8A99B] text-white rounded-md px-3 py-2 text-md font-medium">Inscription</a>
        </div>

        <!--if user is logged in-->
        <div *ngIf="loggedIn">
          <!-- Profile dropdown -->
          <div class="relative ml-3">
            <div>
              <button type="button" class="flex rounded-full bg-gray-800 text-sm" id="user-menu-button" aria-expanded="false" aria-haspopup="true" (click)="menuOpen = !menuOpen">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full object-cover" src="assets/images/user_icon.png" alt="" *ngIf="!user?.avatar">
                <img class="h-8 w-8 rounded-full object-cover" src="http://127.0.0.1:8090/api/files/_pb_users_auth_/{{user?.id}}/{{user?.avatar}}" alt="" *ngIf="user?.avatar">
              </button>
            </div>

            <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1" *ngIf="menuOpen">
            <!-- Active: "bg-gray-100", Not Active: "" -->
            <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Votre profil</a>
            <a href="#" (click)="logout()" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Déconnexion</a>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  <div class="sm:hidden" id="mobile-menu" *ngIf="menuOpen">
    <div class="space-y-1 px-2 pt-2 pb-3">
      <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
      <a routerLink="/bibliotheque" href="#" class="text-white hover:bg-[#B8A99B] block rounded-md px-3 py-2 text-base font-medium">Bibliothèque</a>

      <a routerLink="/auteurs" href="#" class="text-white hover:bg-[#B8A99B] hover:text-white block rounded-md px-3 py-2 text-base font-medium">Auteurs</a>

      <a routerLink="/admin" href="#" class="text-white hover:bg-[#B8A99B] hover:text-white block rounded-md px-3 py-2 text-base font-medium" *ngIf="user?.role == 'admin'">Admin</a>
    </div>
  </div>
</nav>

  `,
  styles: []
})
export class LayoutComponent {

  loggedIn: boolean = false;

  menuOpen: boolean = false;

  userOpen: boolean = false;

  user: Users | undefined;



  constructor(private databaseService: DatabaseService) {
    
  }

  ngOnInit(): void {
    this.databaseService.checkAuth().then(record => {
      this.loggedIn = record;
    }).catch(err => {
      console.log('Error checking user:', err);
    });

    this.databaseService.getUser().then(record => {
      this.user = record;
    }
    ).catch(err => {
      console.log('Error getting user data:', err);
    });

    if (this.loggedIn) {
      this.databaseService.refreshUser();
    }
  }

  logout() {
    this.databaseService.logoutUser();

    window.location.reload();
  }
}
