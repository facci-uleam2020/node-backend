const express = require('express');
const ResultsController = require('../controllers/ResultsController');



const md_auth = require('../middleware/authenticate');

const api = express.Router();

api.post('/add-results', [md_auth.ensureAuth], ResultsController.addResults);
// api.get('/list-exam/:id', [md_auth.ensureAuth], ExamController.listExam);
// api.put('/update-exam/:id', [md_auth.ensureAuth], ExamController.update);
// api.delete('/delete-exam/:id', [md_auth.ensureAuth], ExamController.remove)
// api.get('/list-exam-web/:id', [md_auth.ensureAuth], ExamController.listExamWeb);
// api.put('/update-exam-panel/:id', [md_auth.ensureAuth], ExamController.updatePanel);



module.exports = api;
