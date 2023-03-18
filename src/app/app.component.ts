import { Component } from '@angular/core';
import { LayoutComponent } from './components/layout/layout.component';

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