// Importar las dependencias
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Crear la aplicación de Express
const app = express();
app.use(express.static(__dirname));
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb+srv://admin:cD53735F@cluster0.tdsqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema y modelo de usuario
const usuarioSchema = new mongoose.Schema({
    nombre: String,
    edad: Number
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Rutas
app.get('/favicon.ico', (req, res) => res.status(204));

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// Buscar un usuario por ID o nombre
app.get('/api/usuarios/:query', async (req, res) => {
    const query = req.params.query.toLowerCase();
    try {
        const usuarios = await Usuario.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { _id: query }
            ]
        });
        if (usuarios.length > 0) {
            res.json(usuarios);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar el usuario' });
    }
});

//endpoint para crear nuevo usuario
app.post('/api/usuarios', async (req, res) => {
    const { nombre, edad } = req.body;

    if (!nombre || !edad) {
        return res.status(400).json({ error: 'Nombre y edad son obligatorios' });
    }

    try {
        const nuevoUsuario = new Usuario({ nombre, edad });
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    }catch (err) {
        res.status(500).json({ error: 'Error al guardar el usuario' });
    }
});

// Configurar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
