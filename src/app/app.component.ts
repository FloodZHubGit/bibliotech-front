import { Component } from '@angular/core';
//import the layout component
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  template: `
    <app-layout></app-layout>
    <router-outlet></router-outlet>
  `,
  styles: []
})

export class AppComponent {
}