import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-menu',
  styleUrl: './menu.css',
  templateUrl: './menu.html',
})
export class Menu {
  activo = input<number>(0);
}
