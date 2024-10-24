const Question = require('../model/questionModel');

const questionRepo = {
    // Create a new question
    createQuestion: async (data) => {
        try {
            const question = new Question(data);
            const savedQuestion = await question.save();
            if(!savedQuestion) {
                return {
                    status: 400,
                    message: "Question not saved",
                };
            }
            return {
                status: 200,
                message: "Question saved successfully",
                data: savedQuestion,
            };
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
                error: error.message,
            };
        }
    },

    async getQuestionsGroupedByCategory() {
        try {
            const result = await Question.aggregate([
                {
                    $lookup: {
                        from: 'categories', 
                        localField: 'categories',
                        foreignField: '_id',
                        as: 'categoryDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$categoryDetails',
                        preserveNullAndEmptyArrays: true 
                    }
                },
                {
                    $group: {
                        _id: '$categoryDetails.name', 
                        questions: { $push: { questionId: '$_id', text: '$text', answers: '$answers' } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: '$_id',
                        questions: 1
                    }
                }
            ]);

            if (result.length === 0) {
                return {
                    status: 400,
                    message: "No questions found for any category",
                    
                };
            }

            return {
                status: 200,
                message: "Questions retrieved successfully",
                data: result
            };
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
                error: error.message
            };
        }
    },
};

module.exports = questionRepo;
