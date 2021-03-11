const Exam = require("../models/Exam");

function addExam(req, resp, next) {
  try {
    const exam = new Exam();

    const { user, cursos, question } = req.body;

    exam.user = user;
    exam.cursos = cursos;
    exam.question = question;

    exam.save((err, CarritoStored) => {
      if (err) {
        resp.status(500).send({ message: "Pregunta  ya se ecuentra añadido" });
      } else {
        if (!CarritoStored) {
          resp.status(404).send({ message: "Error al añadir pregunta" });
        } else {
          resp.status(200).send({ message: "Pregunta añadido correctamente" });
        }
      }
    });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function listExam(req, res, next) {
  try {
    let id = req.params.id;
    let cursos = req.query.cursos;
    // console.log(req.query);

    Exam.find({ user: id, cursos: cursos }, { createdAt: 0 }, (err, Stored) => {
      if (err) {
        res.status(500).send({ message: "Error de servidor" });
      } else {
        if (!Stored) {
          res.status(200).send({
            code: 404,
            message: "El registro no existe",
          });
        } else {
          res.status(200).send({ exam: Stored });
        }
      }
    })
      .populate("cursos", { name: 1, price: 1, img: 1 })
      .populate("user", { name: 1 })
      .sort({ createdAt: -1 });
  } catch (error) {
    res.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function update(req, res, next) {
  try {
    let examData = req.body;

    Exam.findByIdAndUpdate(
      { _id: req.params.id },
      {
        question: examData.question,
      },
      (err, examUpdate) => {
        if (err) {
          res.status(500).send({ message: "Error del servidor" });
        } else {
          if (!examUpdate) {
            res
              .status(404)
              .send({ message: "No  se ha encontrado ninguna pregunta" });
          } else {
            res
              .status(200)
              .send({ message: "pregunta se ha actualizado correctamente" });
          }
        }
      }
    );
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function remove(req, res, next) {
  try {
    const { id } = req.params;

    Exam.findByIdAndRemove(id, (err, examDelete) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor" });
      } else {
        if (!examDelete) {
          res.status(404).send({ message: "pregunta no encontrada" });
        } else {
          res
            .status(200)
            .send({ message: "la pregunta ha sido eliminada correctamente" });
        }
      }
    });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function listExamWeb(req, res, next) {
  try {
    let cursos = req.params.id;
 

    Exam.find({ cursos: cursos }, { createdAt: 0 }, (err, Stored) => {
      
      if (err) {
        res.status(500).send({ message: "Error de servidor" });
      } else {
        if (!Stored) {
          res.status(200).send({
            code: 404,
            message: "El registro no existe",
          });
        } else {
          res.status(200).send({ exam: Stored });
        }
      }
    })
      .populate("answers", { answers: 1 , correctAnswers: 1})
      .populate("user", { name: 1 })
      .sort({ createdAt: -1 });
  } catch (error) {
    res.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function updatePanel(req, res, next) {
	try {
	  let examData = req.body;
	  console.log(examData);
	  const exam = Exam();

	 
	  const updateDocument = {
		$push: { "answers": examData.answers},
	  };
	  console.log(updateDocument);
	  Exam.updateOne(
		{ _id: req.params.id },
		updateDocument,
		(err, examUpdate) => {
		  if (err) {
			res.status(500).send({ message: err});
		  } else {
			if (!examUpdate) {
			  res
				.status(404)
				.send({ message: "No  se ha encontrado ninguna pregunta" });
			} else {
				
			  res
				.status(200)
				.send({ message: "pregunta se ha actualizado correctamente" });
			}
		  }
		}
	  );
	} catch (error) {
	  res.status(500).send({ message: error });
	  next(error);
	}
  }


module.exports = {
  addExam,
  listExam,
  update,
  remove,
  listExamWeb,
  updatePanel
};
