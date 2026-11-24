import { Component, signal } from '@angular/core';
import { Formulario } from '../../component/formulario/formulario';
import { Menu } from '../../component/menu/menu';
import { Tabla } from '../../component/tabla/tabla';

@Component({
  imports: [Menu, Tabla, Formulario],
  selector: 'app-orden',
  styleUrl: './orden.css',
  templateUrl: './orden.html',
})
export class Orden {
  lista = true;
  data = signal<Record<string, unknown>[]>([]);
  columnas = [
    { key: 'id', header: 'ID' },
    { key: 'vehiculo', header: 'Vehículo' },
    { key: 'mecanico', header: 'Mecánico' },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'estado', header: 'Estado' },
  ];
  campos = [
    { key: 'vehiculo', label: 'Vehículo', type: 'text' },
    { key: 'mecanico', label: 'Mecánico', type: 'text' },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'estado', label: 'Estado', type: 'text' },
  ];

  mostrar(): void {
    this.lista = !this.lista;
  }

  guardar(datos: Record<string, string | number | null>): void {
    this.data.update((ordenes) => [
      ...ordenes,
      { id: ordenes.length + 1, ...datos },
    ]);
    this.mostrar();
  }
}
