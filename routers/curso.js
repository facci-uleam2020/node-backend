const express = require('express');
const CursoController = require('../controllers/CursoController');
const multipart = require('connect-multiparty');

const md_auth = require('../middleware/authenticate');
const md_upload_img = multipart({ uploadDir: './uploads/imgCursos' });

const api = express.Router();

api.post('/add-curso', [md_auth.ensureAuth], CursoController.add);
api.get('/query-curso/:id', CursoController.query);
api.get('/list-curso/:id', [md_auth.ensureAuth], CursoController.list);
api.get('/list-curso-shopping/:id', [md_auth.ensureAuth], CursoController.listCursoShopping);
api.get('/list-curso-web', CursoController.listCoursesWeb);
api.get('/list-curso-five', CursoController.listCursoFive);
api.put('/update-curso/:id', [md_auth.ensureAuth], CursoController.update);
api.delete('/remove-curso/:id', [md_auth.ensureAuth], CursoController.remove);
api.put('/active-curso/:id', [md_auth.ensureAuth], CursoController.activate);
api.put('/upload-img/:id', [md_auth.ensureAuth, md_upload_img], CursoController.uploadImg);
api.get('/get-img/:cursoName', CursoController.getImg);
api.post('/certificate',  CursoController.Certificate);

module.exports = api;
