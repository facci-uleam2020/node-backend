const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResultsSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
	},
	cursos: {
		type: Schema.ObjectId,
		ref: 'Curso',
	},
	result: Number,

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Results', ResultsSchema);
