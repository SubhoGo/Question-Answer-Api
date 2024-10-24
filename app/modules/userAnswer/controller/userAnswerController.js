const userAnswerRepo = require('../repositories/userAnswerRepo');

class userAnswerController {

    //submit answer
    async submitAnswer(req, res) {
        try {
            const { questionId, selectedAnswer } = req.body;
            const userId = req.user.id;

            const answerData = {
                userId,
                questionId,
                selectedAnswer,
            };

            const result = await userAnswerRepo.submitAnswer(answerData);
            if (result.status === 200) {
                return res.status(200).send({
                    message: result.message,
                    data: result.data,
                    isCorrect: result.isCorrect
                });
            } else if (result.status === 404) {
                return res.status(404).send({
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    //get user answered questions
    async getUserAnsweredQuestions(req, res) {
        try {
            const userId = req.user.id; 

            const result = await userAnswerRepo.getUserAnsweredQuestions(userId);
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                error: error.message
            });
        }
    }
}

module.exports = new userAnswerController();
