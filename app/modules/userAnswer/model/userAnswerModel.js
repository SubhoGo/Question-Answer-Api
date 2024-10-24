const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserAnswerSchema = new schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'question', required: true },
    selectedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('UserAnswer', UserAnswerSchema);
