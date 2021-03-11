const express = require('express');
const ComprasController = require('../controllers/ComprasController');

const md_auth = require('../middleware/authenticate');

const api = express.Router();

api.post('/add-compras', [md_auth.ensureAuth], ComprasController.addCompra);
api.post('/add-purchase-car', [md_auth.ensureAuth], ComprasController.addPurchaseCar);

api.get('/query-compras/:id', [md_auth.ensureAuth], ComprasController.query);
api.get('/list-compras/:id', [md_auth.ensureAuth], ComprasController.list);
api.get('/list-purchase/:id', [md_auth.ensureAuth], ComprasController.listPurchase);
api.get('/list-purchase-course/:id', [md_auth.ensureAuth], ComprasController.listPurchaseCourse);
module.exports = api;
