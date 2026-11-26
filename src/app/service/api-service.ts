import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface MecanicoRegistro {
  [key: string]: unknown;
  id: string | number;
  nombre: string;
  apellido: string;
  telefono?: string;
  codigo?: string;
  horas?: number;
  especialidad?: string;
  id_especialidad?: number;
  disponible?: boolean;
}

export interface Especialidad {
  id: string | number;
  nombre: string;
}

export interface VehiculoRegistro {
  [key: string]: unknown;
  id: number;
  placa: string;
  marca: string;
  modelo: string;
}

export interface OrdenRegistro {
  [key: string]: unknown;
  id: number;
  vehiculo: string;
  mecanico: string;
  descripcion: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class ApiServiceTs {
  private readonly apiUrl = 'http://localhost:3000/api/';
  private readonly http = inject(HttpClient);

  getMecanicos() {
    return this.http.get<MecanicoRegistro[]>(this.apiUrl + 'mecanicos');
  }

  getEspecialidades() {
    return this.http.get<Especialidad[]>(this.apiUrl + 'especialidades');
  }

  guardarMecanico(datos: Record<string, unknown>) {
    return this.http.post(this.apiUrl + 'mecanicos', datos);
  }

  eliminarMecanico(id: string | number) {
    return this.http.delete(this.apiUrl + 'mecanicos/' + id);
  }

  getVehiculos() {
    return this.http.get<VehiculoRegistro[]>(this.apiUrl + 'vehiculos');
  }

  guardarVehiculo(datos: Record<string, unknown>) {
    return this.http.post<VehiculoRegistro>(this.apiUrl + 'vehiculos', datos);
  }

  getOrdenes() {
    return this.http.get<OrdenRegistro[]>(this.apiUrl + 'ordenes');
  }

  guardarOrden(datos: Record<string, unknown>) {
    return this.http.post<OrdenRegistro>(this.apiUrl + 'ordenes', datos);
  }
}
