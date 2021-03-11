const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExamSchema = Schema({
    user: {
		type: Schema.ObjectId,
		ref: 'User',
	},
	cursos: {
		type: Schema.ObjectId,
		ref: 'Curso',
	},
  question: String,
  answers:  [{
	type: Schema.ObjectId,
	ref: 'Answers',
}],
  

});

module.exports = mongoose.model("Exam", ExamSchema);
