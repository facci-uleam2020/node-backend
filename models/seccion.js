const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeccionSchema = new Schema({
	cursos: {
		type: Schema.ObjectId,
		ref: 'Curso',
	},
	name: {
		type: String,
		maxlength: 50,

		required: true,
	},
	description: {
		type: String,
		maxlength: 255,
	},
	video: { type: String },
	nameVideo: { type: String },
	recurso: { type: String },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Seccion', SeccionSchema);
