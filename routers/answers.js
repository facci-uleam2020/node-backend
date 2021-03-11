const express = require('express');
const AnswersController = require('../controllers/AnswersController');



const md_auth = require('../middleware/authenticate');

const api = express.Router();

api.post('/add-answers', [md_auth.ensureAuth], AnswersController.addAnswers);
api.get('/list-answers/:id', [md_auth.ensureAuth], AnswersController.listAnswers);
api.put('/update-answers/:id', [md_auth.ensureAuth], AnswersController.update);
api.delete('/delete-answers/:id', [md_auth.ensureAuth], AnswersController.remove);
api.get('/list-answers-web/:id', [md_auth.ensureAuth], AnswersController.listAnswersWeb);




module.exports = api;
