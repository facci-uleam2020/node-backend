const Seccion = require('../models/seccion');
const thumbsupply = require('thumbsupply');
const fs = require('fs');
const { existsSync, unlink, exists } = require('fs');
const path = require('path');
const { resolve } = require('path');

function add(req, resp, next) {
	try {
		const seccion = new Seccion();

		const { name, description, video, recurso, cursos, estado } = req.body;

		if (!name || name === '') {
			resp.status(404).send({ message: 'nombre no definido, procura definirlo' });
			return null;
		} else {
			seccion.name = name;
		}

		if (!description || description === '') {
			resp.status(404).send({ message: 'descripcion no definida, procura definirlo' });
			return null;
		} else {
			seccion.description = description;
			// seccion.video = video;
			seccion.recurso = recurso;
			seccion.cursos = cursos;

			seccion.save((err, userStored) => {
				if (err) {
					resp.status(500).send({ message: 'Seccion ya existe' });
				} else {
					if (!userStored) {
						resp.status(404).send({ message: 'Error al crear el usuario' });
					} else {
						resp.status(200).send({ message: 'seccion creada correctamente' });
					}
				}
			});
		}
	} catch (error) {
		resp.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

function query(req, res, next) {
	try {
		console.log(req.params.id);
		Seccion.findOne({ _id: req.params.id }, (err, Stored) => {
			if (err) {
				res.status(500).send({ message: 'Error de servidor' });
				//
			} else {
				if (!Stored) {
					res.status(200).send({
						code: 404,
						message: 'La seccion no existe no existe',
					});
				} else {
					res.status(200).send({ Stored });
				}
			}
		}).populate('curso', { name: 1 });
	} catch (error) {
		resp.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

function list(req, res, next) {
	try {
		let id = req.params.id;

		Seccion.find({ cursos: id }, { createdAt: 0 }, (err, Stored) => {
			if (err) {
				res.status(500).send({ message: 'Error de servidor' });
			} else {
				if (!Stored) {
					res.status(200).send({
						code: 404,
						message: 'El registro no existe',
					});
				} else {
					res.status(200).send({ seccion: Stored });
				}
			}
		})
			.populate('cursos', { name: 1 })
			.sort({ createdAt: -1 });
	} catch (error) {
		res.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}
function listSeccionWeb(req, res, next) {
	try {
		let id = req.params.id;

		Seccion.find({ cursos: id }, (err, Stored) => {
			if (err) {
				res.status(500).send({ message: 'Error de servidor' });
			} else {
				if (!Stored) {
					res.status(200).send({
						code: 404,
						message: 'El registro no existe',
					});
				} else {
					res.status(200).send({ seccion: Stored });
				}
			}
		}).populate('cursos', { name: 1 });
	} catch (error) {
		res.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

function update(req, res, next) {
	try {
		let userData = req.body;

		Seccion.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				name: userData.name,
				description: userData.description,
				// video: userData.video,
				recurso: userData.recurso,
			},
			(err, userUpdate) => {
				if (err) {
					res.status(500).send({ message: 'Error del servidor' });
				} else {
					if (!userUpdate) {
						res.status(404).send({ message: 'No  se ha encontrado ningun curso' });
					} else {
						res.status(200).send({ message: 'seccion se ha actualizado correctamente' });
					}
				}
			}
		);
	} catch (error) {
		resp.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}
function updateCampusVideo(req, res, next) {
	try {
		let userData = req.body;

		Seccion.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				video: userData.video,
			},
			(err, userUpdate) => {
				if (err) {
					res.status(500).send({ message: 'Error del servidor' });
				} else {
					if (!userUpdate) {
						res.status(404).send({ message: 'No  se ha encontrado ningun secion' });
					} else {
						res.status(200).send({ message: 'Seccion se ha actualizado correctamente' });
					}
				}
			}
		);
	} catch (error) {
		resp.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

function remove(req, res, next) {
	try {
		const { id } = req.params;

		const pathViejo = resolve(__dirname, `../uploads/video/${req.params.video}`);

		Seccion.findByIdAndRemove({ _id: id }, (err, userDelete) => {
			if (err) {
				res.status(500).send({ message: 'Error del servidor' });
			} else {
				if (!userDelete) {
					res.status(404).send({ message: 'Curso no encontrado' });
				} else {
					if (existsSync(pathViejo)) {
						unlink(pathViejo, () => {});
					}

					res.status(200).send({ message: 'El curso ha sido eliminado correctamente' });
				}
			}
		});
	} catch (error) {
		resp.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

function uploadVideo(req, res, next) {
	try {
		const params = req.params;

		Seccion.findById({ _id: params.id }, (err, seccionData) => {
			console.log(seccionData);
			if (err) {
				res.status(500).send({ message: err });
			} else {
				if (!seccionData) {
					res.status(404).send({ message: 'No  se ha encontrado ninguna seccion con ese id' });
				} else {
					let seccion = seccionData;

					if (req.files) {
						let filePath = req.files.video.path;
						let fileSplit = filePath.split('\\');
						let fileName = fileSplit[2];

						let extSplit = fileName.split('.');

						let fileExt = extSplit[1];

						if (fileExt !== 'mp4') {
							res.status(400).end({
								message: 'La extension del video  no es valida. (Extensiones permitidas: .mp4)',
							});
						} else {
							seccion.video = fileName;
							seccion.nameVideo = req.files.video.name;
							Seccion.findByIdAndUpdate({ _id: params.id }, seccion, (err, seccionResult) => {
								if (err) {
									res.status(500).send({ message: 'Error del servidor.' });
								} else {
									if (!seccionResult) {
										res.status(404).send({ message: 'No se ha encontrado ninguna seccion.' });
									} else {
										res.status(200).send({ seccionName: fileName });
									}
								}
							});
						}
					}
				}
			}
		});
	} catch (error) {
		resp.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}

	// console.log(res.req.file.path);
	// var storage = multer.diskStorage({
	// 	destination: function (req, file, cb) {
	// 		cb(null, 'uploads/video/');
	// 	},
	// 	filename: function (req, file, cb) {
	// 		cb(null, `${Date.now()}_${file.originalname}`);
	// 	},
	// 	fileFilter: (req, file, cb) => {
	// 		const ext = path.extname(file.originalname);
	// 		if (ext !== '.mp4') {
	// 			return cb(res.status(400).end('formato no valido revise que sea mp4'), false);
	// 		}
	// 		cb(null, true);
	// 	},
	// });

	// var upload = multer({ storage: storage }).single('file');
	// upload(req, res, (err) => {
	// 	if (err) {
	// 		return res.json({ success: false, err });
	// 	}

	// 	return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename });
	// });
}

function updateVideo(req, res, next) {
	// console.log(req.query);
	const params = req.query;
	console.log(req.params.videoName);
	const pathViejo = resolve(__dirname, `../uploads/video/${req.params.videoName}`);

	if (existsSync(pathViejo)) {
		try {
			Seccion.findById({ _id: params.id }, (err, seccionData) => {
				if (err) {
					res.status(500).send({ message: err });
				} else {
					if (!seccionData) {
						res.status(404).send({ message: 'No  se ha encontrado ninguna seccion con ese id' });
					} else {
						let seccion = seccionData;

						if (req.files) {
							let filePath = req.files.video.path;
							console.log(req.files.video.name);
							let fileSplit = filePath.split('\\');
							let fileName = fileSplit[2];

							let extSplit = fileName.split('.');

							let fileExt = extSplit[1];

							if (fileExt !== 'mp4') {
								res.status(400).end({
									message: 'La extension del video  no es valida. (Extensiones permitidas: .mp4)',
								});
							} else {
								unlink(pathViejo, () => {});
								seccion.video = fileName;
								seccion.nameVideo = req.files.video.name;
								Seccion.findByIdAndUpdate({ _id: params.id }, seccion, (err, seccionResult) => {
									if (err) {
										res.status(500).send({ message: 'Error del servidor.' });
									} else {
										if (!seccionResult) {
											res.status(404).send({ message: 'No se ha encontrado ninguna seccion.' });
										} else {
											res.status(200).send({ seccionName: fileName });
										}
									}
								});
							}
						}
					}
				}
			});
		} catch (error) {
			resp.status(500).send({ message: 'Ocurrio un error' });
			next(error);
		}
	}
}

function getVideo(req, res) {
	const videoName = req.params.videoName;
	const filePath = './uploads/video/' + videoName;
	fs.exists(filePath, (exists) => {
		if (!exists) {
			res.status(404).send({ message: 'El video que buscas no existe' });
		} else {
			res.sendFile(path.resolve(filePath));
		}
	});
}

module.exports = {
	add,
	query,
	list,
	update,
	remove,
	uploadVideo,
	updateVideo,
	getVideo,
	updateCampusVideo,
	listSeccionWeb,
};
