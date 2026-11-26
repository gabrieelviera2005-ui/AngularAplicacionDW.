import { Component, OnInit, signal } from '@angular/core';
import { Formulario } from '../../component/formulario/formulario';
import { Menu } from '../../component/menu/menu';
import { Tabla } from '../../component/tabla/tabla';
import { ApiServiceTs, OrdenRegistro } from '../../service/api-service';

@Component({
  imports: [Menu, Tabla, Formulario],
  selector: 'app-orden',
  styleUrl: './orden.css',
  templateUrl: './orden.html',
})
export class Orden implements OnInit {
  lista = true;
  data = signal<OrdenRegistro[]>([]);
  mensaje = signal<string | null>(null);
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

  constructor(private readonly apiService: ApiServiceTs) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.apiService.getOrdenes().subscribe({
      next: (ordenes) => this.data.set(ordenes),
      error: (err: unknown) => {
        console.error('Error al cargar órdenes:', err);
        this.mensaje.set('No se pudieron cargar las órdenes. Verifica la conexión con la API.');
      },
    });
  }

  mostrar(): void {
    this.lista = !this.lista;
    this.mensaje.set(null);
  }

  guardar(datos: Record<string, string | number | null>): void {
    this.apiService.guardarOrden(datos).subscribe({
      next: () => {
        this.cargar();
        this.lista = true;
      },
      error: (err: unknown) => {
        console.error('Error al guardar orden:', err);
        this.mensaje.set('No se pudo guardar la orden de servicio.');
      },
    });
  }
}
