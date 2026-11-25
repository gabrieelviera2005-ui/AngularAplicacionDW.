const cors = require('cors');
const express = require('express');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const especialidades = [
  { id: 1, nombre: 'Motor' },
  { id: 2, nombre: 'Frenos' },
  { id: 3, nombre: 'Transmisión' },
  { id: 4, nombre: 'Electricidad' },
];

let mecanicos = [];
let siguienteId = 1;

app.get('/api/especialidades', (_req, res) => {
  res.json(especialidades);
});

app.get('/api/mecanicos', (req, res) => {
  const { especialidad, disponible } = req.query;
  let resultado = mecanicos;

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
  const mecanico = mecanicos.find((item) => item.id === Number(req.params.id));
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

  const mecanico = {
    id: siguienteId++,
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    codigo: codigo.trim(),
    especialidad: especialidad.nombre,
    id_especialidad: especialidad.id,
    horas: horasNumero,
    disponible: true,
  };

  mecanicos.push(mecanico);
  res.status(201).json(mecanico);
});

app.delete('/api/mecanicos/:id', (req, res) => {
  const indice = mecanicos.findIndex((item) => item.id === Number(req.params.id));
  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Mecánico no encontrado' });
  }

  mecanicos.splice(indice, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
