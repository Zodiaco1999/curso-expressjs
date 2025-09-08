require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('./generated/prisma');
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

app.get('/users', (req, res) => {
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send({error: 'Error interno del servidor'});
    }

    const users = JSON.parse(data);
    res.json(users);
  });
});

app.post('/users', (req, res) => {
  const newUser = req.body;

  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send({error: 'Error interno del servidor'});
    }

    const users = JSON.parse(data);

    const { isValid, error } = validateUser(newUser, users);
    if (!isValid) {
      return res.status(400).send({ error: error });
    }

    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).send({error: 'Error escribiendo el archivo de usuarios'});
      }
      res.status(201).json(newUser);
    });
  });
});

app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send({error: 'Error interno del servidor'});
    }
    let users = JSON.parse(data);
    const { isValid, error } = validateUser(updatedUser, users);
    if (!isValid) {
      return res.status(400).send({ error: error });
    }

    users = users.map(user => 
      user.id === userId ? {...user, ...updatedUser} : user
    );
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).send({error: 'Error escribiendo el archivo de usuarios'});
      }
      res.status(200).json(updatedUser);
    });

  });
});

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error con conexiÃ³n de datos.' });
    }
    let users = JSON.parse(data);
    users = users.filter(user => user.id !== userId);
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar usuario.' });
      }
      res.status(204).send();
    });
  });
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

app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso a ruta protegida concedido', user: req.user });
});

app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'USER'
    },
  });
  res.status(201).json({ message: 'User Registered Successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!user || !isValidPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ 
    id: user.id, 
    role: user.role 
  }, 
  process.env.JWT_SECRET);
  res.json({ token });
});