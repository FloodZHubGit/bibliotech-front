import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { BibliothequeComponent } from './components/bibliotheque/bibliotheque.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuteursComponent } from './components/auteurs/auteurs.component';
import { ProfileIdComponent } from './components/profile/profile-id/profile-id.component';
import { BookComponent } from './components/book/book.component';
import { AddbookComponent } from './components/addbook/addbook.component';
import { EditpageComponent } from './components/editpage/editpage.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'bibliotheque', component: BibliothequeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:id', component: ProfileIdComponent},
  { path: 'auteurs', component: AuteursComponent },
  { path: 'book/:id', component: BookComponent },
  { path: 'add-book', component: AddbookComponent },
  { path: 'edit-page/:id', component: EditpageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
