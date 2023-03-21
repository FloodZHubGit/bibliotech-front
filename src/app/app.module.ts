import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import PocketBase from 'pocketbase';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { BibliothequeComponent } from './components/bibliotheque/bibliotheque.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuteursComponent } from './auteurs/auteurs.component';
import { ProfileIdComponent } from './components/profile/profile-id/profile-id.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    BibliothequeComponent,
    ProfileComponent,
    AuteursComponent,
    ProfileIdComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
