const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ComprasSchema = new Schema({
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
	card: String,
	// description: String,
	// email: String,
	// defaultSource: String,
	// currency: String,

	createdAt: {
		type: Date,
		default: Date.now,
	},
});


module.exports = mongoose.model('Compras', ComprasSchema);
