const express = require('express');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

app.use(express.json());


let estudiantes = [];
let excelError = null;

function loadestudiantesFromExcel() {
    try {
        const filePath = path.join(__dirname, 'Lista de Estudiantes.xlsx');
        const workbook = xlsx.readFile(filePath);
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = xlsx.utils.sheet_to_json(worksheet);
        
        excelError = null;
        return rawData.map((row, index) => ({
            id: index + 1,
            nombre: row['Nombre'],
            email: row['Correo Electrónico'],
            nota: row['Nota'] ? parseFloat(row['Nota']) : 0
        }));
    } catch (error) {
        excelError = error.mensaje;
        return [];
    }
}

// Carga de los estudiantes desde el archivo Excel
estudiantes = loadestudiantesFromExcel();

// Verificación de la carga del archivo Excel
app.get('/', (req, res) => {
    if (excelError) {
        res.status(500).send(`
            <h1 style="color:red;">Error al leer el archivo Excel</h1>
            <p><strong>Mensaje técnico:</strong> ${excelError}</p>
            <p>💡 <em>Tip: Si dice "ENOENT", el archivo no está en la carpeta correcta o tiene otro nombre. Si dice "EBUSY", cierra el archivo de Excel en tu computadora.</em></p>
        `);
    } else {
        res.send(`
            <h1 style="color:green;">¡Servidor leyendo Excel con éxito!</h1>
            <p>Se cargaron <strong>${estudiantes.length}</strong> estudiantes de forma correcta.</p>
            <p>Ve a <a href="/estudiantes">/estudiantes</a> para ver el JSON.</p>
        `);
    }
});

// Endpoint para consultar la lista de todos  los estudiantes
app.get('/estudiantes', (req, res) => {
    res.status(200).json(estudiantes);
});

// Endpoint para consultar un estudiante
app.get('/estudiantes/:id', (req, res) => {
    const id = Number(req.params.id);
    const student = estudiantes.find((item) => item.id === id);

    if (!student) {
        return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    }

    res.status(200).json(student);
});

// Endpoint para insertar un nuevo estudiante
app.post('/estudiantes', (req, res) => {
    const { nombre, email, nota } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ mensaje: 'El nombre y el correo electrónico son obligatorios' });
    }

    const newStudent = {
        id: estudiantes.length > 0 ? Math.max(...estudiantes.map((item) => item.id)) + 1 : 1,
        nombre,
        email,
        nota: nota !== undefined ? Number(nota) : 0
    };

    estudiantes.push(newStudent);
    res.status(201).json({ mensaje: 'Estudiante insertado con éxito', estudiante: newStudent });
});

// Endpoint para actualizar un estudiante
app.put('/estudiantes/:id', (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email, nota } = req.body;
    const studentIndex = estudiantes.findIndex((item) => item.id === id);

    if (studentIndex === -1) {
        return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    }

    if (!nombre && !email && nota === undefined) {
        return res.status(400).json({ mensaje: 'Debes enviar al menos un campo para actualizar' });
    }

    const student = estudiantes[studentIndex];
    estudiantes[studentIndex] = {
        ...student,
        nombre: nombre !== undefined ? nombre : student.nombre,
        email: email !== undefined ? email : student.email,
        nota: nota !== undefined ? Number(nota) : student.nota
    };

    res.status(200).json({ mensaje: 'Estudiante actualizado con éxito', estudiante: estudiantes[studentIndex] });
});

// Endpoint para eliminar un estudiante
app.delete('/estudiantes/:id', (req, res) => {
    const id = Number(req.params.id);
    const studentIndex = estudiantes.findIndex((item) => item.id === id);

    if (studentIndex === -1) {
        return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    }

    const deletedStudent = estudiantes.splice(studentIndex, 1)[0];
    res.status(200).json({ mensaje: 'Estudiante eliminado con éxito', estudiante: deletedStudent });
});

app.listen(PORT, () => {
    console.log(`Servidor de diagnóstico corriendo en http://localhost:${PORT}`);
});