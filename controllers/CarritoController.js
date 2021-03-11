const Carrito = require('../models/Carrito');
const Compras = require('../models/Compras');
function addCarrito(req, resp, next) {
	try {
		const carrito = new Carrito();

		const { user, cursos, estado } = req.body;
		console.log(req.body);

		if (!user || user === '') {
			resp.status(404).send({ message: 'usuario no existe, procura estar logeado' });
			return null;
		} else {
			carrito.user = user;
		}

		if (!cursos || cursos === '') {
			resp.status(404).send({ message: 'Curso no existe, procura definirlo' });
			return null;
		} else {
			carrito.estado = estado;

			carrito.cursos = cursos;

			Carrito.find({ user: user, cursos: cursos }, (err, Stored) => {
				// console.log(JSON.stringify(Stored[0]?.cursos) == JSON.stringify(carrito.cursos) ? true : false);
				console.log(err);
				if (err) {
					resp.status(500).send({ message: 'Curso  ya se ecuentra añadido' });
				} else {
					if (JSON.stringify(Stored[0]?.cursos) === JSON.stringify(carrito?.cursos)) {
						resp.status(404).send({ message: 'Error curso ya esta añadido al carrito' });
					} else if (!Stored) {
						carrito.save((err, CarritoStored) => {
							if (err) {
								resp.status(500).send({ message: 'Curso  ya se ecuentra añadido' });
							} else {
								if (!CarritoStored) {
									resp.status(404).send({ message: 'Error al añadir al carrito' });
								} else {
									resp.status(200).send({ message: 'Curso añadido al carrito correctamente' });
								}
							}
						});
					} else {
						carrito.save((err, CarritoStored) => {
							if (err) {
								resp.status(500).send({ message: 'Curso  ya se ecuentra añadido' });
							} else {
								if (!CarritoStored) {
									resp.status(404).send({ message: 'Error al añadir al carrito' });
								} else {
									resp.status(200).send({ message: 'Curso añadido al carrito correctamente' });
								}
							}
						});
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
		Compras.findOne({ _id: req.params.id }, (err, Stored) => {
			if (err) {
				res.status(500).send({ message: 'Error de servidor' });
				//
			} else {
				if (!Stored) {
					res.status(200).send({
						code: 404,
						message: 'La compra no existe',
					});
				} else {
					res.status(200).send({ Stored });
				}
			}
		}).populate('compra', { name: 1 });
	} catch (error) {
		res.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

function list(req, res, next) {
	try {
		let id = req.params.id;
		// console.log(req.query);

		Carrito.find({ user: id, estado: req.query.estado }, { createdAt: 0 }, (err, Stored) => {
			Stored.map((result) => {
				Compras.find({ user: id, cursos: result.cursos._id }, (err, ResultPay) => {
					ResultPay.map((pay) => {
						Carrito.find({ user: pay.user, cursos: pay.cursos }, async (err, deletCard) => {
							await deletCard.map(async (resu) => {
								await deleteCarAccionPay(resu._id);
							});
						});
					});
					// Carrito.findById({ cursos: ResultPay.cursos }, (err, deletCard) => {
					// 	console.log(deletCard);
					// });
				});
			});
			if (err) {
				res.status(500).send({ message: 'Error de servidor' });
			} else {
				if (!Stored) {
					res.status(200).send({
						code: 404,
						message: 'El registro no existe',
					});
				} else {
					res.status(200).send({ carrito: Stored });
				}
			}
		})
			.populate('cursos', { name: 1, price: 1, img: 1 })
			.populate('user', { name: 1 })
			.sort({ createdAt: -1 });
	} catch (error) {
		res.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}
function carPending(req, res) {
	const { id } = req.params;

	const { estado } = req.body;

	Carrito.findByIdAndUpdate(id, { estado }, (err, carStored) => {
		if (err) {
			res.status(500).send({ message: 'Error del servidor' });
		} else {
			if (!carStored) {
				res.status(404).send({ message: 'No se ha encontrado el  curso' });
			} else {
				if (estado === true) {
					res.status(200).send({ message: 'Curso añadido correctamente al carrito' });
				} else {
					res.status(200).send({ message: 'Curso añadido  a pendiente correctamente ' });
				}
			}
		}
	});
}

function deleteCar(req, res) {
	const { id } = req.params;

	Carrito.findByIdAndRemove(id, (err, carDelete) => {
		if (err) {
			res.status(500).send({ message: 'Error del servidor' });
		} else {
			if (!carDelete) {
				res.status(404).send({ message: 'El curso  no encontrado' });
			} else {
				res.status(200).send({ message: 'El curso  ha sido eliminado del carrito correctamente' });
			}
		}
	});
}

function deleteCarAccionPay(id) {
	Carrito.findByIdAndRemove(id, (err, carDelete) => {
		if (err) {
			console.log(err);
		} else {
			// if (!carDelete) {
			// 	res.status(404).send({ message: 'El curso  no encontrado' });
			// } else {
			// 	res.status(200).send({ message: 'El curso  ha sido eliminado del carrito correctamente' });
			// }
			console.log(carDelete);
		}
	});
}
module.exports = {
	addCarrito,
	list,
	carPending,
	deleteCar,
};
