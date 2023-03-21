import { Component } from '@angular/core';

@Component({
  selector: 'app-bibliotheque',
  template: `
    <div class="p-4 text-center">
      <h1 class="text-3xl font-bold mb-4">Bienvenue sur la page de la bibliothèque !</h1>

      <div class="book">
        <div class="book__cover"></div>
        <div class="book__page book__page--left"></div>
        <div class="book__page book__page--right"></div>
      </div>
    </div>
      `,
  styles: []
})
export class BibliothequeComponent {

}
