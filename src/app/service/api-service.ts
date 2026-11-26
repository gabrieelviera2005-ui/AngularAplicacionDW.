import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface MecanicoRegistro {
  [key: string]: unknown;
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
}

export interface Especialidad {
  id: string;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class ApiServiceTs {
  private readonly apiUrl = 'http://vmi3607581.contaboserver.net/taller/';
  private readonly http = inject(HttpClient);

  getMecanicos() {
    return this.http.get<MecanicoRegistro[]>(this.apiUrl + 'lista');
  }

  getEspecialidades() {
    return this.http.get<Especialidad[]>(this.apiUrl + 'especialidades');
  }

  guardarMecanico(datos: Record<string, unknown>) {
    return this.http.post(this.apiUrl + 'mecanicos', datos);
  }

  eliminarMecanico(id: string) {
    return this.http.delete(this.apiUrl + 'mecanicos/' + id);
  }
}
