const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarritoSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
	},
	cursos: {
		type: Schema.ObjectId,
		ref: 'Curso',
	},
	estado: {
		type: Boolean,
		default: false,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Carrito', CarritoSchema);
