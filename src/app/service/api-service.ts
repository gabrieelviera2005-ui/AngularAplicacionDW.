import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface MecanicoRegistro {
  [key: string]: unknown;
  id: number;
  nombre: string;
  apellido: string;
  codigo: string;
  especialidad: string;
  horas: number;
}

export interface Especialidad {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class ApiServiceTs {
  private readonly apiUrl = 'http://TU_SERVIDOR/taller/';
  private readonly http = inject(HttpClient);

  getMecanicos() {
    return this.http.get<MecanicoRegistro[]>(this.apiUrl + 'lista');
  }

  getEspecialidades() {
    return this.http.get<Especialidad[]>(this.apiUrl + 'especialidades');
  }

  guardarMecanico(datos: Record<string, unknown>) {
    return this.http.post(this.apiUrl + 'nuevo_mecanico', datos);
  }

  eliminarMecanico(id: number) {
    return this.http.post(this.apiUrl + 'eliminar_mecanico', id);
  }
}
