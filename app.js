require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const loggerMiddleware = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const authenticateToken = require('./middlewares/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validateUser } = require('./utils/validation');
const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
});

app.get('/', (req, res) => 
    res.send(`
        <h1>Curso Express.js</h1>
        <p>Bienvenidos al curso de Express.js</p>
        <p>Corre en el puerto ${PORT}</p>
    `));

app.get('/users/:id', (req , res) => {
  const userId = req.params.id;
  res.send(`Detalles del usuario con ID: ${userId}`);
});

app.get('/search', (req, res) => {
  const terms = req.query.termino || 'No especificado';
  const category = req.query.categoria || 'Todas';
  res.send(`
        <h1>Resultado de búsqueda</h1>
        <p>Término: ${terms}</p>
        <p>Categoría: ${category}</p>
  `);
});

app.post('/api/data', (req, res) => {
  const { name, email } = req.body;
  res.send(`
        <h1>Datos recibidos</h1>
        <p>Nombre: ${name}</p>
        <p>Email: ${email}</p>
  `);
});


app.get('/error', (req, res, next) => {
  next(new Error('Este es un error de prueba'));
});

app.get('/db-users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al comunicarse con la base de datos.' });
  }
});