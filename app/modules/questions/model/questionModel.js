const mongoose = require('mongoose');
const schema = mongoose.Schema;

const AnswerSchema = new schema({
    answerText: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
});

const QuestionSchema = new schema({
    text: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    answers: {
        type: [AnswerSchema],
        validate: {
            validator: function(v) {
                return v.length === 4; 
            },
            message: 'A question must have exactly 4 answers.'
        }
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('question', QuestionSchema);
