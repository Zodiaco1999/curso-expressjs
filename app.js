require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => 
    res.send(`
        <h1>Curso Express.js</h1>
        <p>Bienvenidos al curso de Express.js</p>
        <p>Corre en el puerto ${PORT}</p>
    `));

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
});
