import { Routes } from '@angular/router';
import { Inicio } from './page/inicio/inicio';
import { Mecanico } from './page/mecanico/mecanico';
import { Orden } from './page/orden/orden';
import { Vehiculo } from './page/vehiculo/vehiculo';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'mecanico', component: Mecanico },
  { path: 'vehiculo', component: Vehiculo },
  { path: 'orden', component: Orden },
  { path: '**', redirectTo: '' }
];
