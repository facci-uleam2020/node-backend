const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const CursoSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
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
	estado: {
		type: Boolean,
		default: false,
	},
	price: {
		type: Number,
	},
	img: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

CursoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Curso', CursoSchema);
