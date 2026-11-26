import { Component, computed, OnInit, signal } from '@angular/core';
import { Menu } from '../../component/menu/menu';
import { Tabla } from '../../component/tabla/tabla';
import { Formulario } from '../../component/formulario/formulario';
import { ApiServiceTs, Especialidad, MecanicoRegistro } from '../../service/api-service';

@Component({
  imports: [Menu, Tabla, Formulario],
  selector: 'app-mecanico',
  styleUrl: './mecanico.css',
  templateUrl: './mecanico.html',
})
export class Mecanico implements OnInit {
  data = signal<MecanicoRegistro[]>([]);
  especialidades = signal<Especialidad[]>([]);
  lista = true;
  mensaje = signal<{ texto: string; tipo: string } | null>(null);

  constructor(private readonly apiService: ApiServiceTs) {}

  ngOnInit(): void {
    this.cargar();
    this.cargarEspecialidades();
  }

  cargar(): void {
    this.apiService.getMecanicos().subscribe({
      next: (result: MecanicoRegistro[]) => this.data.set(result),
      error: (err: unknown) => {
        console.error('Error al cargar mecánicos:', err);
        this.mensaje.set({
          texto: 'Ocurrió un error al cargar los mecánicos. Verifica la conexión con la API.',
          tipo: 'alert alert-danger',
        });
      }
    });
  }

  cargarEspecialidades(): void {
    this.apiService.getEspecialidades().subscribe({
      next: (result: Especialidad[]) => this.especialidades.set(result),
      error: (err: unknown) => {
        console.error('Error al cargar especialidades:', err);
        this.mensaje.set({
          texto: 'Ocurrió un error al cargar las especialidades. Verifica la conexión con la API.',
          tipo: 'alert alert-danger',
        });
      }
    });
  }

  opcionesEspecialidades = computed(() =>
    this.especialidades().map((especialidad) => ({
      label: especialidad.nombre,
      value: especialidad.id,
    }))
  );

  camposMecanico = computed(() => [
    { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej. Juan' },
    { key: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Ej. Pérez' },
    { key: 'codigo', label: 'Código', type: 'text' },
    { key: 'horas', label: 'Horas', type: 'number' },
    {
      key: 'id_especialidad',
      label: 'Especialidad',
      type: 'select',
      options: this.opcionesEspecialidades(),
    },
  ]);

  guardarMecanico(datos: Record<string, string | number | null>): void {
    this.apiService.guardarMecanico(datos).subscribe({
      next: () => {
        this.cargar();
        this.mensaje.set({
          texto: '¡Registro guardado con éxito!',
          tipo: 'alert alert-success',
        });
        setTimeout(() => this.mensaje.set(null), 4000);
      },
      error: (err: unknown) => {
        console.error('Error al guardar mecánico:', err);
        this.mensaje.set({
          texto: 'Ocurrió un error al intentar guardar el registro.',
          tipo: 'alert alert-danger',
        });
      }
    });
    this.mostrar();
  }

  eliminarRegistro(id: string | number): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el registro con ID: ${id}?`)) {
      this.apiService.eliminarMecanico(id).subscribe({
        next: () => this.cargar(),
        error: (err: unknown) => {
          console.error('Error al eliminar:', err);
          this.mensaje.set({
            texto: 'Ocurrió un error al intentar eliminar el registro.',
            tipo: 'alert alert-danger',
          });
        }
      });
    }
  }

  mostrar(): void {
    this.lista = !this.lista;
  }

  columnasUsuarios = [
    { key: 'id', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'apellido', header: 'Apellido' },
    { key: 'codigo', header: 'Código' },
    { key: 'especialidad', header: 'Especialidad' },
    { key: 'horas', header: 'Horas' },
  ];
}
