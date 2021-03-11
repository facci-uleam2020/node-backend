const Compras = require('../models/Compras');
const { STRIPE_API_KEY } = require('../config');
const stripeApi = require('stripe')(STRIPE_API_KEY);
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const chalk = require('chalk');

async function addCompra(req, resp, next) {
	try {
		const compra = new Compras();
		// const list = req.body;
		// conole.log(req.body)

		const { user, cursos, number, expiry, cvc, amount, email, description } = req.body;
		const separation = expiry.split('');

		const exp_month = separation[0] + separation[1];
		const exp_year = separation[2] + separation[3];

		if (!user || user === '') {
			resp.status(404).send({ message: 'usuario no existe, procura estar logeado' });
			return null;
		} else {
			compra.user = user;
		}
		if (!number || number === '') {
			resp.status(404).send({ message: 'número de tarjeta no valido, procura definirlo' });
			return null;
		}
		if (!exp_month || exp_month === '') {
			resp.status(404).send({ message: 'mes de vencimiento no valido, procura definirlo' });
			return null;
		}
		if (!exp_year || exp_year === '') {
			resp.status(404).send({ message: 'año de vencimiento no valido, procura definirlo' });
			return null;
		}
		if (!cvc || cvc === '') {
			resp.status(404).send({ message: 'clave de seguridad de la tarjeta no valido, procura definirlo' });
			return null;
		}

		if (!cursos || cursos === '') {
			resp.status(404).send({ message: 'Curso no existe, procura definirlo' });
			return null;
		} else {
			const token = await stripeApi.tokens.create({
				card: {
					number: number,
					exp_month: exp_month,
					exp_year: exp_year,
					cvc: cvc,
				},
			});
			// console.log(token?.card?.id);
			// console.log(token);

			compra.card = token.card.id;

			compra.cursos = cursos;
			Compras.find({ user: user, cursos: cursos }, async (err, Stored) => {
				if (err) {
					resp.status(500).send({ message: 'Curso o usuario no correcto' });
				} else if (JSON.stringify(Stored[0]?.cursos) === JSON.stringify(compra?.cursos)) {
					resp.status(404).send({ message: 'Error este curso ya lo compraste' });
				} else if (!Stored) {
					resp.status(500).send({ message: 'A ocurrido un error al realizar la compra' });
				} else {
					const payment = Math.round((+amount + Number.EPSILON) * 100) / 100;

					const paymentfinish = payment * 100;
					const client = await stripeApi.customers.retrieve(user);
					if (client.default_source === null) {
						await stripeApi.customers
							.createSource(user, {
								source: token.id,
							})
							.then(
								async function (result) {
									if (result) {
										await stripeApi.charges
											.create({
												amount: paymentfinish,
												customer: user,
												currency: 'usd',
												source: compra.card,
												receipt_email: email,
												description: description,
												receipt_url: (parent) => parent.receipt_url,

												// description: 'My First Test Charge (created for API docs)',
											})
											.then(
												function (results) {
													console.log(results.receipt_url);
													if (results) {
														compra.save(async (err, CompraStored) => {
															console.log(CompraStored);
															if (err) {
																resp.status(500).send({
																	message: 'Compra ya está  realizada',
																});
															} else {
																if (!CompraStored) {
																	resp.status(404).send({
																		message: 'Error al hacer la compra',
																	});
																} else {
																	// if (!StripeInvalidRequestError) {
																	// stripeApi.customers.createSource(user, { source: token.id });
																	// } else {
																	// 	console.log('actualizar');
																	// }

																	// await stripeApi.charges.create({
																	// 	amount: paymentfinish,
																	// 	customer: user,
																	// 	currency: 'usd',
																	// 	source: compra.card,
																	// 	// description: 'My First Test Charge (created for API docs)',
																	// });
																	sendEmail(results.receipt_url, description, email);
																	resp.status(200).send({
																		message: 'compra realizada correctamente',
																	});
																}
															}
														});
													}
												},
												function (errs) {
													if (errs) {
														resp.status(500).send({
															message: errs.message,
														});
													}
												}
											);
									}
								},
								function (err) {
									resp.status(500).send({
										message: err.message,
									});
								}
							);
					} else {
						await stripeApi.customers
							.update(user, {
								source: token.id,
							})
							.then(
								async function (result) {
									if (result) {
										let list = await stripeApi.customers.listSources(user);

										await list?.data?.map(async (item) => {
											if (item.id !== token.card.id && token.card.id !== '') {
												await stripeApi.customers.deleteSource(user, item.id || '');
											}
										});

										await stripeApi.charges
											.create({
												amount: paymentfinish,
												customer: user,
												currency: 'usd',
												source: token.card.id,
												receipt_email: email,
												description: description,
												receipt_url: (parent) => parent.receipt_url,

												// description: 'My First Test Charge (created for API docs)',
											})
											.then(
												function (results) {
													console.log(results.receipt_url);
													if (results) {
														compra.save(async (err, CompraStored) => {
															console.log(CompraStored);
															if (err) {
																resp.status(500).send({
																	message: 'Compra ya está  realizada',
																});
															} else {
																if (!CompraStored) {
																	resp.status(404).send({
																		message: 'Error al hacer la compra',
																	});
																} else {
																	// if (!StripeInvalidRequestError) {
																	// stripeApi.customers.createSource(user, { source: token.id });
																	// } else {
																	// 	console.log('actualizar');
																	// }

																	// await stripeApi.charges.create({
																	// 	amount: paymentfinish,
																	// 	customer: user,
																	// 	currency: 'usd',
																	// 	source: compra.card,
																	// 	// description: 'My First Test Charge (created for API docs)',
																	// });
																	sendEmail(results.receipt_url, description, email);
																	resp.status(200).send({
																		message: 'compra realizada correctamente',
																	});
																}
															}
														});
													}
												},
												function (errs) {
													if (errs) {
														resp.status(500).send({
															message: errs.message,
														});
													}
												}
											);
									}
								},
								function (err) {
									resp.status(500).send({
										message: err.message,
									});
								}
							);
					}
				}
			});
		}
	} catch (error) {
		resp.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

async function addPurchaseCar(req, res, next) {
	try {
		const purchase = new Compras();
		const listCar = req.body.data2;
		const infoCard = req.body.data1;

		const { user, number, expiry, cvc, amount, email } = infoCard;
		const separation = expiry?.split('');

		const exp_month = separation[0] + separation[1];
		const exp_year = separation[2] + separation[3];

		// const momentoComida = await listCar.map(function (comida) {
		// 	return Compras.find({ user: comida.user._id, cursos: comida.cursos._id }, async (err, Stored) => {
		// 		console.log(1 + 1);
		// 	});
		// });
		purchase.user = user;
		var totalAges = listCar?.reduce(
			(sum, value) => (typeof value.cursos.price == 'number' ? sum + value.cursos.price : sum),
			0
		);
		// const a = listCar.find((resultado) => resultado);

		// console.log(a);

		listCar.find(async (result) => {
			// console.log(result);
			await Compras.find({ user: result.user._id, cursos: result.cursos._id }, async (err, Stored) => {
				if (err) {
					res.status(500).send({ message: 'Curso o usuario no correcto' });
				} else if (!Stored) {
					resp.status(500).send({ message: 'A ocurrido un error al realizar la compra' });
				} else {
					const token = await stripeApi.tokens.create({
						card: {
							number: number,
							exp_month: exp_month,
							exp_year: exp_year,
							cvc: cvc,
						},
					});

					const payment = Math.round((+totalAges + Number.EPSILON) * 100) / 100;

					const paymentfinish = payment * 100;
					const client = await stripeApi.customers.retrieve(user);
					if (client.default_source === null) {
						await stripeApi.customers
							.createSource(user, {
								source: token.id,
							})
							.then(
								async function (results) {
									if (results) {
										await stripeApi.charges
											.create({
												amount: paymentfinish,
												customer: user,
												currency: 'usd',
												// source: compra.card,
												receipt_email: email,
												description: `compra de  ${listCar.length} cursos`,
												receipt_url: (parent) => parent.receipt_url,

												// description: 'My First Test Charge (created for API docs)',
											})
											.then(
												function (trueV) {
													if (trueV) {
														// await listCar.map((data) => {
														// 	console.log(data);
														// purchase.cursos = data.cursos._id;
														try {
															Compras.insertMany(listCar).then(
																function (result) {
																	sendEmailNew(
																		trueV.receipt_url,
																		listCar.length,
																		email
																	);
																	res.status(200).send({
																		message: 'compra realizada correctamente',
																	});
																},
																function (err) {
																	console.log('A ocurrido un error');
																}
															);
														} catch (error) {
															console.log(error);
														}
													}
												},
												function (errs) {
													if (errs) {
														resp.status(500).send({
															message: errs.message,
														});
													}
												}
											);
									}
								},
								function (err) {
									resp.status(500).send({
										message: err.message,
									});
								}
							);
					} else {
						await stripeApi.customers
							.update(user, {
								source: token.id,
							})
							.then(async function (results) {
								// console.log(results);
								if (results) {
									await stripeApi.charges
										.create({
											amount: paymentfinish,
											customer: user,
											currency: 'usd',
											// source: purchase.card,
											receipt_email: email,
											description: `compra de  ${listCar.length} cursos`,
											receipt_url: (parent) => parent.receipt_url,

											// description: 'My First Test Charge (created for API docs)',
										})
										.then(
											async function (trueV) {
												// console.log('trueV', trueV.receipt_url);
												if (trueV) {
													// await listCar.map((data) => {
													// 	console.log(data);
													// purchase.cursos = data.cursos._id;
													try {
														Compras.insertMany(listCar).then(
															function (result) {
																sendEmailNew(trueV.receipt_url, listCar.length, email);
																res.status(200).send({
																	message: 'compra realizada correctamente',
																});
															},
															function (err) {
																console.log('A ocurrido un error');
															}
														);
													} catch (error) {
														console.log(error);
													}
												}
											},
											function (error) {}
										);
								}
							});
					}
				}
				// console.log(JSON.stringify(Stored?.cursos) === JSON.stringify(purchase?.cursos) ? false : true);
				// console.log(purchase.cursos);
			});
		});

		// await listCar?.map((list) => {});
	} catch (error) {
		res.status(500).send({ message: error});
		next(error);
	}
}
function query(req, res, next) {

	try {
		Compras.findOne({ user: req.params.id , cursos: req.query.courseId  }, (err, Stored) => {
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
		let cursos = req.query.cursos;
		console.log(cursos);

		Compras.find({ user: id, cursos: cursos }, { createdAt: 0 }, (err, Stored) => {
			if (err) {
				res.status(500).send({ message: 'Error de servidor' });
			} else {
				if (!Stored) {
					res.status(200).send({
						code: 404,
						message: 'El registro no existe',
					});
				} else {
					res.status(200).send({ compras: Stored });
				}
			}
		})
			.populate('cursos', { name: 1 })
			.populate('user', { name: 1 })
			.sort({ createdAt: -1 });
	} catch (error) {
		res.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

async function sendEmail(url, description, email) {
	console.log('descripcion', description);
	const html = `Haz realizado correctamente la  ${description} para ver tu factura  da clic en el siguiente enlace
			 : <a href="${url}" target="_blank">Click aqui</a>  `;
	const transport = await nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'faciiuleam2020@gmail.com',
			pass: 'zgmmmwaoklddnhum',
		},
	});

	await transport
		.verify()
		.then(() => {
			console.log('==============================NODEMAILER CONFIG==============================');
			console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
			console.log(`STATUS: ${chalk.greenBright('MAILER CONNECT')}`);
		})
		.catch((error) => {
			console.log('==============================NODEMAILER CONFIG==============================');
			console.log(`STATUS: ${chalk.greenBright('OFFILE')}`);
			console.log(`STATUS: ${chalk.redBright(error)}`);
		});

	await transport.sendMail({
		from: '"🛍️ Facci Cursos" <faciiuleam2020@gmail.com>',
		to: email,
		subject: 'Factura del curso ',
		text: ' factura del curso comprado',
		html,
	});
}
async function sendEmailNew(url, description, email) {
	console.log('url', url);
	const html = `Haz realizado correctamente la compra de  ${description} cursos para ver tu factura  da clic en el siguiente enlace
			 : <a href="${url}" target="_blank">Click aqui</a>  `;
	const transport = await nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'faciiuleam2020@gmail.com',
			pass: 'zgmmmwaoklddnhum',
		},
	});

	await transport
		.verify()
		.then(() => {
			console.log('==============================NODEMAILER CONFIG==============================');
			console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
			console.log(`STATUS: ${chalk.greenBright('MAILER CONNECT')}`);
		})
		.catch((error) => {
			console.log('==============================NODEMAILER CONFIG==============================');
			console.log(`STATUS: ${chalk.greenBright('OFFILE')}`);
			console.log(`STATUS: ${chalk.redBright(error)}`);
		});

	await transport.sendMail({
		from: '"🛍️ Facci Cursos" <faciiuleam2020@gmail.com>',
		to: email,
		subject: 'Factura del curso ',
		text: ' factura del curso comprado',
		html,
	});
}

function listPurchase(req, res, next) {
	try {
		let id = req.params.id;
		
		
		

		Compras.find({ user: id }, { createdAt: 0 }, (err, Stored) => {
			if (err) {
				res.status(500).send({ message: 'Error de servidor' });
			} else {
				if (!Stored) {
					res.status(200).send({
						code: 404,
						message: 'El registro no existe',
					});
				} else {
					res.status(200).send({ compras: Stored });
				}
			}
		})
			.populate('cursos', { name: 1 , description: 1, img: 1 })
			.populate('user', { name: 1 })
			.sort({ createdAt: -1 });
	} catch (error) {
		res.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}

function listPurchaseCourse(req, res, next) {
	try {
		let id = req.params.id;
		
		
		

		Compras.find({ cursos: id }, { createdAt: 0 }, (err, Stored) => {
			if (err) {
				res.status(500).send({ message: 'Error de servidor' });
			} else {
				if (!Stored) {
					res.status(200).send({
						code: 404,
						message: 'El registro no existe',
					});
				} else {
					res.status(200).send({ compras: Stored });
				}
			}
		})
			.populate('cursos', { name: 1 , description: 1, img: 1 })
			.populate('user', { name: 1, lastname: 1, email: 1, avatar: 1 })
			.sort({ createdAt: -1 });
	} catch (error) {
		res.status(500).send({ message: 'Ocurrio un error' });
		next(error);
	}
}


module.exports = {
	addCompra,
	query,
	list,
	addPurchaseCar,
	listPurchase,
	listPurchaseCourse
};
