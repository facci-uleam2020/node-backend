const Curso = require("../models/curso");
const fs = require("fs");
const path = require("path");
const { existsSync, unlink, exists } = require("fs");
const { resolve } = require("path");


function add(req, resp, next) {
  try {
    const curso = new Curso();

    const { name, description, estado, price, user } = req.body;

    if (!name || name === "") {
      resp
        .status(404)
        .send({ message: "nombre no definido, procura definirlo" });
      return null;
    } else {
      curso.name = name;
    }

    if (!description || description === "") {
      resp
        .status(404)
        .send({ message: "descripcion no definida, procura definirlo" });
      return null;
    } else {
      curso.description = description;
    }
    if (!price || price === "") {
      resp
        .status(404)
        .send({ message: "precio no definida, procura definirlo" });
      return null;
    } else {
      curso.price = price;
      curso.estado = estado;
      curso.user = user;

      curso.save((err, userStored) => {
        if (err) {
          resp.status(500).send({ message: "Curso ya existe" });
        } else {
          if (!userStored) {
            resp.status(404).send({ message: "Error al crear el curso" });
          } else {
            resp.status(200).send({ message: "Curso correctamente creado" });
          }
        }
      });
    }
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function query(req, res, next) {
  console.log(req.params);
  try {
    Curso.findOne({ _id: req.params.id }, (err, Stored) => {
      if (err) {
        res.status(500).send({ message: "Error de servidor" });
        //
      } else {
        if (!Stored) {
          res.status(200).send({
            code: 404,
            message: "El registro no existe",
          });
        } else {
          res.status(200).send({ cursos: Stored });
        }
      }
    });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function list(req, res, next) {
  try {
    let id = req.params.id;
    console.log(id);
    // console.log(query.estado);
    Curso.find(
      { user: id, estado: req.query.estado },
      { createdAt: 0 },
      (err, Stored) => {
        if (err) {
          res.status(500).send({ message: "Error de servidor" });
          //
        } else {
          if (!Stored) {
            resp.status(200).send({
              code: 404,
              message: "El registro no existe",
            });
          } else {
            res.status(200).send({ curso: Stored });
            // console.log(Stored);
          }
        }
      }
    ).sort({ createdAt: -1 });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}
function listCoursesWeb(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page,
      sort: { createdAt: -1 },
      limit: parseInt(limit),
    };
    // console.log(query.estado);
    Curso.paginate({ estado: req.query.estado }, options, (err, Stored) => {
      if (err) {
        res.status(500).send({ message: "Error de servidor" });
        //
      } else {
        if (!Stored) {
          res.status(200).send({
            code: 404,
            message: "El registro no existe",
          });
        } else {
          res.status(200).send({ curso: Stored });
          // console.log(Stored);
        }
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}
function listCursoShopping(req, res, next) {
  try {
    Curso.find(
      { _id: req.params.id, estado: req.query.estado },
      { createdAt: 0 },
      (err, Stored) => {
        if (err) {
          res.status(500).send({ message: "Error de servidor" });
          //
        } else {
          if (!Stored) {
            resp.status(200).send({
              code: 404,
              message: "El registro no existe",
            });
          } else {
            res.status(200).send({ curso: Stored });

            // console.log(Stored);
          }
        }
      }
    ).sort({ createdAt: -1 });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function listCursoFive(req, res, next) {
  try {
    Curso.find(
      { estado: req.query.estado },
      { createdAt: 0 },
      (err, Stored) => {
        if (err) {
          res.status(500).send({ message: "Error de servidor" });
          //
        } else {
          if (!Stored) {
            resp.status(200).send({
              code: 404,
              message: "El registro no existe",
            });
          } else {
            res.status(200).send({ curso: Stored });

            // console.log(Stored);
          }
        }
      }
    )
      .sort({ createdAt: -1 })
      .limit(6);
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function update(req, res, next) {
  try {
    let userData = req.body;

    Curso.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: userData.name,
        description: userData.description,
        price: userData.price,
      },
      (err, userUpdate) => {
        if (err) {
          res.status(500).send({ message: "Error del servidor" });
        } else {
          if (!userUpdate) {
            res
              .status(404)
              .send({ message: "No  se ha encontrado ningun curso" });
          } else {
            res
              .status(200)
              .send({ message: "Curso se ha actualizado correctamente" });
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

    Curso.findByIdAndRemove(id, (err, userDelete) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor" });
      } else {
        if (!userDelete) {
          res.status(404).send({ message: "Curso no encontrado" });
        } else {
          res
            .status(200)
            .send({ message: "El curso ha sido eliminado correctamente" });
        }
      }
    });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function activate(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    Curso.findByIdAndUpdate(id, { estado }, (err, userUpdate) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor" });
      } else {
        if (!userUpdate) {
          res
            .status(404)
            .send({ message: "No  se ha encontrado ningun curso" });
        } else {
          res.status(200).send({
            message: `Curso se ha ${
              estado ? "habilitado" : "deshabilitado"
            }  correctamente`,
          });
        }
      }
    });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function desactivate(req, res, next) {
  try {
    const params = req.params;

    Curso.findByIdAndUpdate(
      { _id: params.id },
      { status: 0 },
      (err, userUpdate) => {
        if (err) {
          res.status(500).send({ message: "Error del servidor" });
        } else {
          if (!userUpdate) {
            res
              .status(404)
              .send({ message: "No  se ha encontrado ningun curso" });
          } else {
            res
              .status(200)
              .send({ message: "Curso se ha actualizado correctamente" });
          }
        }
      }
    );
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}

function uploadImg(req, res, next) {
  try {
    const params = req.params;

    Curso.findById({ _id: params.id }, (err, cursoData) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor" });
      } else {
        if (!cursoData) {
          res
            .status(404)
            .send({ message: "No  se ha encontrado ningun curso" });
        } else {
          console.log(cursoData);
          const pathViejo = resolve(
            __dirname,
            `../uploads/imgCursos/${cursoData.img}`
          );
         
		  let curso = cursoData;
		  if (existsSync(pathViejo)) { 
			unlink(pathViejo, () => {});
		  }
          // res.status(200).send({ message: 'Curso se ha actualizado correctamente' });
          if (req.files) {
            let filePath = req.files.img.path;
            let fileSplit = filePath.split("\\");
            let fileName = fileSplit[2];

            let extSplit = fileName.split(".");
            console.log(extSplit);
            let fileExt = extSplit[1];

            if (fileExt !== "png" && fileExt !== "jpg") {
              res.status(400).send({
                message:
                  "La extension de la imagen no es valida. (Extensiones permitidas: .png y .jpg)",
              });
            } else {
              curso.img = fileName;
              Curso.findByIdAndUpdate(
                { _id: params.id },
                curso,
                (err, cursoResult) => {
                  if (err) {
                    res.status(500).send({ message: "Error del servidor." });
                  } else {
                    if (!cursoResult) {
                      res
                        .status(404)
                        .send({ message: "No se ha encontrado ningun curso." });
                    } else {
                      res.status(200).send({ cursoName: fileName });
                    }
                  }
                }
              );
            }
          }
        }
      }
    });
  } catch (error) {
    resp.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}
function getImg(req, res) {
  const cursoName = req.params.cursoName;
  const filePath = "./uploads/imgCursos/" + cursoName;
  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ message: "La imagen que buscas no existe" });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}


function Certificate(req, res, next){

try {
  

   
  } catch (error) {
    res.status(500).send({ message: "Ocurrio un error" });
    next(error);
  }
}
module.exports = {
  add,
  query,
  list,
  update,
  remove,
  activate,
  desactivate,
  uploadImg,
  getImg,
  listCursoFive,
  listCoursesWeb,
  listCursoShopping,
  Certificate
};
