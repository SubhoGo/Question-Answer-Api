const questionRepo = require('../repositories/questionRepo');

const questionController = {
    // Create a new question
    async createQuestion (req, res){
        try {
            const questionData = req.body; 
        const result = await questionRepo.createQuestion(questionData);
        if(result.status === 200){
            return res.status(200).json({
                status : 200,
                message : result.message,
                data : result.data
            })
        } else {
            return res.status(400).json({
                status : 400,
                message : result.message
            })
        }
        } catch (error) {
            return res.status(500).json({
                status : 500,
                message : "Internal server error",
                error : error.message
            })
        }
    },

    // Get all questions from each category
    async getQuestionsByCategory(req, res) {
        try {
            const result = await questionRepo.getQuestionsGroupedByCategory();
            if(result.status === 200){
                return res.status(200).json({
                    status : 200,
                    message : result.message,
                    data : result.data
                })
            } else if (result.status === 400) {
                return res.status(400).json({
                    status : 400,
                    message : result.message
                })
            }
        } catch (error) {
            return res.status(500).json({
                status : 500,
                message : "Internal server error",
                error : error.message
            })
        }
    }
};

module.exports = questionController;
