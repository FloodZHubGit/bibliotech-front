import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { BibliothequeComponent } from './components/bibliotheque/bibliotheque.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuteursComponent } from './auteurs/auteurs.component';
import { ProfileIdComponent } from './components/profile/profile-id/profile-id.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'bibliotheque', component: BibliothequeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:id', component: ProfileIdComponent},
  { path: 'auteurs', component: AuteursComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
