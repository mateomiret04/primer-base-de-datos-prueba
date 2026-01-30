const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // AGREGADO: Importamos CORS
require('dotenv').config();

const app = express();

// CONFIGURACIÓN DE MIDDLEWARES
app.use(cors()); // AGREGADO: Permite que el front hable con el back
app.use(express.json());
app.use(express.static('public')); // AGREGADO: Para que Render sirva tu index.html

// Conexión a la base de datos de Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ruta para probar si el servidor y la base de datos se hablan
app.get('/prueba', async (req, res) => {
  try {
    const resDB = await pool.query('SELECT NOW()');
    res.json({ 
      mensaje: "¡Servidor y Neon conectados con éxito! 🚀", 
      hora_en_neon: resDB.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ error: "Error de conexión", detalle: err.message });
  }
});

// Ruta para registrar un nuevo cliente
app.post('/registrar', async (req, res) => {
    const { nombre, dni, localidad } = req.body; 

    try {
        const query = 'INSERT INTO clientes (nombre, dni, localidad) VALUES ($1, $2, $3) RETURNING *';
        const values = [nombre, dni, localidad];
        
        const result = await pool.query(query, values);
        
        res.status(201).json({
            mensaje: "Cliente registrado con éxito",
            cliente: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al registrar cliente", detalle: err.message });
    }
});

const PORT = process.env.PORT || 3000; // AJUSTADO: Render usa su propio puerto
app.listen(PORT, () => {
  console.log(`✅ Servidor encendido en puerto ${PORT}`);
});