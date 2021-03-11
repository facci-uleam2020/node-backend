const express = require('express');
const CarritoController = require('../controllers/CarritoController');

const md_auth = require('../middleware/authenticate');

const api = express.Router();

api.post('/add-carrito', [md_auth.ensureAuth], CarritoController.addCarrito);

// api.get('/query-compras/:id', [md_auth.ensureAuth], ComprasController.query);
api.get('/list-carrito/:id', [md_auth.ensureAuth], CarritoController.list);
api.put('/activate-carrito/:id', [md_auth.ensureAuth], CarritoController.carPending);
api.delete('/delete-car/:id', [md_auth.ensureAuth], CarritoController.deleteCar);

module.exports = api;
