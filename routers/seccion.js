const express = require('express');
const SeccionController = require('../controllers/SeccionController');
const multipart = require('connect-multiparty');

const md_auth = require('../middleware/authenticate');
const md_upload_video = multipart({ uploadDir: './uploads/video' });

const api = express.Router();

api.post('/add-seccion', [md_auth.ensureAuth], SeccionController.add);
api.get('/query-seccion/:id', SeccionController.query);
api.get('/list-seccion/:id', [md_auth.ensureAuth], SeccionController.list);
api.get('/list-seccion-web/:id', SeccionController.listSeccionWeb);
api.put('/update-seccion/:id', [md_auth.ensureAuth], SeccionController.update);
api.put('/updateCampus-video/:id', [md_auth.ensureAuth], SeccionController.updateCampusVideo);

api.delete('/remove-seccion/:id/:video', [md_auth.ensureAuth], SeccionController.remove);
api.post('/upload-video/:id', [md_auth.ensureAuth, md_upload_video], SeccionController.uploadVideo);
api.put('/update-video/:videoName', [md_auth.ensureAuth, md_upload_video], SeccionController.updateVideo);
api.get('/get-video/:videoName', SeccionController.getVideo);

module.exports = api;
