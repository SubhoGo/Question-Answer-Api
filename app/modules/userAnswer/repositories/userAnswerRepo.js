const UserAnswer = require('../model/userAnswerModel');
const Question = require('../../questions/model/questionModel');
const mongoose = require('mongoose');
const userAnswerRepo = {
    //submit answer by a user
    submitAnswer: async (data) => {
        try {
            const question = await Question.findById(data.questionId);
            if (!question) {
                return {
                    status: 404,
                    message: "Question not found",
                };
            }

            const isCorrect = question.answers.some(answer => 
                answer._id.toString() === data.selectedAnswer && answer.isCorrect
            );

            const userAnswer = new UserAnswer(data);
            const savedAnswer = await userAnswer.save();

            return {
                status: 200,
                message: isCorrect ? "Correct answer submitted" : "Incorrect answer submitted",
                data: savedAnswer,
                isCorrect: isCorrect
            };
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
                error: error.message,
            };
        }
    },

    //specific users answerd questions
    async getUserAnsweredQuestions(userId) {
        try {
          const results = await UserAnswer.aggregate([
            {
              $match: { userId: new mongoose.Types.ObjectId(userId) },
            },
            {
              $lookup: {
                from: "questions",
                localField: "questionId",
                foreignField: "_id",
                as: "questionDetails",
              },
            },
            {
              $unwind: "$questionDetails",
            },
            {
              $lookup: {
                from: "categories",
                localField: "questionDetails.categories",
                foreignField: "_id",
                as: "categories",
              },
            },
            {
              $project: {
                _id: 0,
                questionId: "$questionDetails._id",
                questionText: "$questionDetails.text",
                categories: "$categories.name",
                selectedAnswer: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$questionDetails.answers",
                        as: "answer",
                        cond: { $eq: ["$$answer._id", "$selectedAnswer"] },
                      },
                    },
                    0,
                  ],
                },
                createdAt: {
                  $dateToString: {
                    format: "%Y-%m-%d %H:%M:%S",
                    date: "$createdAt",
                  },
                },
              },
            },
          ]);
          
          return {
            status: 200,
            message: "User answered questions retrieved successfully",
            data: results,
          };
        } catch (error) {
          return {
            status: 500,
            message: "Internal server error",
            error: error.message,
          };
        }
      }
    
};

module.exports = userAnswerRepo;
