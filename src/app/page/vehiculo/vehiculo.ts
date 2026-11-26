import { Component, OnInit, signal } from '@angular/core';
import { Formulario } from '../../component/formulario/formulario';
import { Menu } from '../../component/menu/menu';
import { Tabla } from '../../component/tabla/tabla';
import { ApiServiceTs, VehiculoRegistro } from '../../service/api-service';

@Component({
  imports: [Menu, Tabla, Formulario],
  selector: 'app-vehiculo',
  styleUrl: './vehiculo.css',
  templateUrl: './vehiculo.html',
})
export class Vehiculo implements OnInit {
  lista = true;
  data = signal<VehiculoRegistro[]>([]);
  mensaje = signal<string | null>(null);
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

  constructor(private readonly apiService: ApiServiceTs) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.apiService.getVehiculos().subscribe({
      next: (vehiculos) => this.data.set(vehiculos),
      error: (err: unknown) => {
        console.error('Error al cargar vehículos:', err);
        this.mensaje.set('No se pudieron cargar los vehículos. Verifica la conexión con la API.');
      },
    });
  }

  mostrar(): void {
    this.lista = !this.lista;
    this.mensaje.set(null);
  }

  guardar(datos: Record<string, string | number | null>): void {
    this.apiService.guardarVehiculo(datos).subscribe({
      next: () => {
        this.cargar();
        this.lista = true;
      },
      error: (err: unknown) => {
        console.error('Error al guardar vehículo:', err);
        this.mensaje.set('No se pudo guardar el vehículo.');
      },
    });
  }
}
