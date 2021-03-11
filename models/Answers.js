const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswersSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  exam: {
    type: Schema.ObjectId,
    ref: "Exam",
  },
  answers: String,
  correctAnswers: Boolean,
});

module.exports = mongoose.model("Answers", AnswersSchema);
