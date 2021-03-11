const Results = require("../models/results");


function addResults(req, resp, next) {
    try {
      const results = new Results();
  
      const { user, cursos, result } = req.body;
  
      results.user = user;
      results.cursos = cursos;
      results.result = result;
  
      results.save((err, ResultsStored) => {
        if (err) {
          resp.status(500).send({ message: "Examen   ya se ecuentra añadido" });
        } else {
          if (!ResultsStored) {
            resp.status(404).send({ message: "Error al enviar examen" });
          } else {
            resp.status(200).send({ message: "Examen enviado correctamente" });
          }
        }
      });
    } catch (error) {
      resp.status(500).send({ message: "Ocurrio un error" });
      next(error);
    }
  }


  module.exports = {
    addResults

  };
  