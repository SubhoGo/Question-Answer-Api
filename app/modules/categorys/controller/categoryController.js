const Category = require('../repositories/categoryRepo')

class categoryController {

    //Category create
    async categorySave(req,res){
        try {
            const data = req.body;
            const result = await Category.createCategory(data);
            if(result.status === 200){
                return res.status(200).json({
                    status : 200,
                    message : result.message,
                    data : result.data
                })
            }else{
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

    // Get all questions count from each category
    async categoryCountWithQuestionCount(req, res) {
        try {
            const result = await Category.getCategoriesWithQuestionCount();
            if (result.status === 200) {
                return res.status(200).json({
                    status: 200,
                    message: result.message,
                    data: result.data
                });
            } 
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                error: error.message
            });
        }
    }
}

module.exports = new categoryController();