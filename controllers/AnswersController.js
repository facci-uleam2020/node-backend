const Answers = require("../models/Answers");

function addAnswers(req, resp, next) {
  try {
    const answ = new Answers();

    const { user, exam, answers, correctAnswers } = req.body;

    answ.user = user;
    answ.exam = exam;
    answ.answers = answers;
    answ.correctAnswers = correctAnswers;

    answ.save((err, AnswersStored) => {
      if (err) {
        resp.status(500).send({ message: "Respuesta  ya se ecuentra añadido" });
      } else {
        if (!AnswersStored) {
          resp.status(404).send({ message: "Error al añadir respuesta" });
        } else {
          resp.status(200).send({ an: AnswersStored });
        }
      }
    });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function listAnswers(req, res, next) {
  try {
    let id = req.params.id;
    let exam = req.query.exam;

    Answers.find({ user: id, exam: exam }, { createdAt: 0 }, (err, Stored) => {
      if (err) {
        res.status(500).send({ message: "Error de servidor" });
      } else {
        if (!Stored) {
          res.status(200).send({
            code: 404,
            message: "El registro no existe",
          });
        } else {
          res.status(200).send({ answers: Stored });
        }
      }
    })
      .populate("exam", { question: 1 })
      .populate("user", { name: 1 })
      .sort({ createdAt: -1 });
  } catch (error) {
    res.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function update(req, res, next) {
  try {
    let AnswersData = req.body;

    Answers.findByIdAndUpdate(
      { _id: req.params.id },
      {
        answers: AnswersData.answers,
        correctAnswers: AnswersData.correctAnswers,
      },
      (err, answersUpdate) => {
        if (err) {
          res.status(500).send({ message: "Error del servidor" });
        } else {
          if (!answersUpdate) {
            res
              .status(404)
              .send({ message: "No  se ha encontrado ninguna respuesta" });
          } else {
            res
              .status(200)
              .send({ message: "respuesta se ha actualizado correctamente" });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function remove(req, res, next) {
  try {
    const { id } = req.params;

    Answers.findByIdAndRemove(id, (err, answersDelete) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor" });
      } else {
        if (!answersDelete) {
          res.status(404).send({ message: "respuesta no encontrada" });
        } else {
          res
            .status(200)
            .send({ message: "la respuesta ha sido eliminada correctamente" });
        }
      }
    });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function listAnswersWeb(req, res, next) {
  try {
    let exam = req.params.id;
    console.log(req.params);

    Answers.find({ exam: exam }, { createdAt: 0 }, (err, Stored) => {
      if (err) {
        res.status(500).send({ message: "Error de servidor" });
      } else {
        if (!Stored) {
          res.status(200).send({
            code: 404,
            message: "El registro no existe",
          });
        } else {
          res.status(200).send({ answers: Stored });
        }
      }
    })
      .populate("exam", { question: 1 })
      .populate("user", { name: 1 })
      .sort({ createdAt: -1 });
  } catch (error) {
    res.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

module.exports = {
  addAnswers,
  listAnswers,
  update,
  remove,
  listAnswersWeb,
};
