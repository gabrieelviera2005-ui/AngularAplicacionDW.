import { Component, signal } from '@angular/core';
import { Formulario } from '../../component/formulario/formulario';
import { Menu } from '../../component/menu/menu';
import { Tabla } from '../../component/tabla/tabla';

@Component({
  imports: [Menu, Tabla, Formulario],
  selector: 'app-vehiculo',
  styleUrl: './vehiculo.css',
  templateUrl: './vehiculo.html',
})
export class Vehiculo {
  lista = true;
  data = signal<Record<string, unknown>[]>([]);
  columnas = [
    { key: 'id', header: 'ID' },
    { key: 'placa', header: 'Placa' },
    { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' },
  ];
  campos = [
    { key: 'placa', label: 'Placa', type: 'text', placeholder: 'Ej. P123456' },
    { key: 'marca', label: 'Marca', type: 'text' },
    { key: 'modelo', label: 'Modelo', type: 'text' },
  ];

  mostrar(): void {
    this.lista = !this.lista;
  }

  guardar(datos: Record<string, string | number | null>): void {
    this.data.update((vehiculos) => [
      ...vehiculos,
      { id: vehiculos.length + 1, ...datos },
    ]);
    this.mostrar();
  }
}
