const Category = require('../model/categoryModel');

const categoryRepo = {

    //category create
    createCategory : async(data)=>{
        try {
            const category = new Category(data);
            const saveCategory = await category.save();
            if(!saveCategory){
                return {
                    status : 400,
                    message :"Category not saved"
                    }
                }
            return {
                    status : 200,
                    message :"Category saved successfully",
                    data : saveCategory
                }
        } catch (error) {
            return {
                status : 500,
                message :"Internal server error",
                error : error.message
            }
        }
    },
    
    //total category with question count of each category
    async getCategoriesWithQuestionCount() {
        try {
            const result = await Category.aggregate([
                {
                    $lookup: {
                        from: 'questions', 
                        localField: '_id',
                        foreignField: 'categories',
                        as: 'questions'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1, 
                        questionCount: { $size: '$questions' } 
                    }
                }
            ]);

            return {
                status: 200,
                message: "Categories retrieved successfully",
                data: result
            };
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
                error: error.message
            };
        }
    }
}

module.exports = categoryRepo;