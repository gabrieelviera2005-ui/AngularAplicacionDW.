const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const archivosDatos = {
  mecanicos: path.join(__dirname, 'mecanicos.json'),
  vehiculos: path.join(__dirname, 'vehiculos.json'),
  ordenes: path.join(__dirname, 'ordenes.json'),
};

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const especialidades = [
  { id: 1, nombre: 'Motor' },
  { id: 2, nombre: 'Frenos' },
  { id: 3, nombre: 'Transmisión' },
  { id: 4, nombre: 'Electricidad' },
];

function leerRegistros(archivo, entidad) {
  if (!fs.existsSync(archivo)) {
    return [];
  }

  try {
    const datos = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    if (!Array.isArray(datos)) {
      throw new Error(`El archivo de ${entidad} debe contener una lista`);
    }

    return datos;
  } catch {
    throw new Error(`No se pudo leer el archivo de ${entidad}`);
  }
}

function guardarRegistros(archivo, registros) {
  const temporal = `${archivo}.tmp`;
  fs.writeFileSync(temporal, JSON.stringify(registros, null, 2), 'utf8');
  fs.renameSync(temporal, archivo);
}

app.get('/api/especialidades', (_req, res) => {
  res.json(especialidades);
});

app.get('/api/mecanicos', (req, res) => {
  const { especialidad, disponible } = req.query;
  let resultado;

  try {
    resultado = leerRegistros(archivosDatos.mecanicos, 'mecánicos');
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }

  if (especialidad) {
    resultado = resultado.filter(
      (mecanico) =>
        mecanico.especialidad.toLowerCase() === String(especialidad).toLowerCase()
    );
  }

  if (disponible !== undefined) {
    const esDisponible = disponible === 'true';
    resultado = resultado.filter((mecanico) => mecanico.disponible === esDisponible);
  }

  res.json(resultado);
});

app.get('/api/mecanicos/:id', (req, res) => {
  let mecanico;

  try {
    mecanico = leerRegistros(archivosDatos.mecanicos, 'mecánicos')
      .find((item) => item.id === Number(req.params.id));
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }

  if (!mecanico) {
    return res.status(404).json({ mensaje: 'Mecánico no encontrado' });
  }

  res.json(mecanico);
});

app.post('/api/mecanicos', (req, res) => {
  const { nombre, apellido, codigo, id_especialidad, horas } = req.body;
  const especialidad = especialidades.find(
    (item) => item.id === Number(id_especialidad)
  );
  const horasNumero = Number(horas);

  if (
    typeof nombre !== 'string' ||
    !nombre.trim() ||
    typeof apellido !== 'string' ||
    !apellido.trim() ||
    typeof codigo !== 'string' ||
    !codigo.trim() ||
    !especialidad ||
    !Number.isFinite(horasNumero) ||
    horasNumero < 0
  ) {
    return res.status(400).json({ mensaje: 'Datos del mecánico no válidos' });
  }

  try {
    const mecanicos = leerRegistros(archivosDatos.mecanicos, 'mecánicos');
    const siguienteId =
      mecanicos.reduce((mayor, item) => Math.max(mayor, Number(item.id) || 0), 0) + 1;
    const mecanico = {
      id: siguienteId,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      codigo: codigo.trim(),
      especialidad: especialidad.nombre,
      id_especialidad: especialidad.id,
      horas: horasNumero,
      disponible: true,
    };

    mecanicos.push(mecanico);
    guardarRegistros(archivosDatos.mecanicos, mecanicos);
    res.status(201).json(mecanico);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.delete('/api/mecanicos/:id', (req, res) => {
  try {
    const mecanicos = leerRegistros(archivosDatos.mecanicos, 'mecánicos');
    const indice = mecanicos.findIndex((item) => item.id === Number(req.params.id));
    if (indice === -1) {
      return res.status(404).json({ mensaje: 'Mecánico no encontrado' });
    }

    mecanicos.splice(indice, 1);
    guardarRegistros(archivosDatos.mecanicos, mecanicos);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.get('/api/vehiculos', (_req, res) => {
  try {
    res.json(leerRegistros(archivosDatos.vehiculos, 'vehículos'));
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.post('/api/vehiculos', (req, res) => {
  const { placa, marca, modelo } = req.body;
  if ([placa, marca, modelo].some((valor) => typeof valor !== 'string' || !valor.trim())) {
    return res.status(400).json({ mensaje: 'Datos del vehículo no válidos' });
  }

  try {
    const vehiculos = leerRegistros(archivosDatos.vehiculos, 'vehículos');
    const vehiculo = {
      id: vehiculos.reduce((mayor, item) => Math.max(mayor, Number(item.id) || 0), 0) + 1,
      placa: placa.trim(),
      marca: marca.trim(),
      modelo: modelo.trim(),
    };

    vehiculos.push(vehiculo);
    guardarRegistros(archivosDatos.vehiculos, vehiculos);
    res.status(201).json(vehiculo);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.get('/api/ordenes', (_req, res) => {
  try {
    res.json(leerRegistros(archivosDatos.ordenes, 'órdenes'));
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.post('/api/ordenes', (req, res) => {
  const { vehiculo, mecanico, descripcion, estado } = req.body;
  if ([vehiculo, mecanico, descripcion, estado].some(
    (valor) => typeof valor !== 'string' || !valor.trim()
  )) {
    return res.status(400).json({ mensaje: 'Datos de la orden no válidos' });
  }

  try {
    const ordenes = leerRegistros(archivosDatos.ordenes, 'órdenes');
    const orden = {
      id: ordenes.reduce((mayor, item) => Math.max(mayor, Number(item.id) || 0), 0) + 1,
      vehiculo: vehiculo.trim(),
      mecanico: mecanico.trim(),
      descripcion: descripcion.trim(),
      estado: estado.trim(),
    };

    ordenes.push(orden);
    guardarRegistros(archivosDatos.ordenes, ordenes);
    res.status(201).json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
