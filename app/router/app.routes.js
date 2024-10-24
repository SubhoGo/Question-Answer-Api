const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

const categoryController = require('../modules/categorys/controller/categoryController');
const questionController = require('../modules/questions/controller/questionController');
const userController = require('../modules/users/controller/userController');
const userAnswerController = require('../modules/userAnswer/controller/userAnswerController');
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null , "./public/uploads")
    },
    filename : (req,file,cb)=>{
        cb(
            null,
            file.fieldname +
            "_" +
            Date.now() +
            "myImg" + 
            path.extname(file.originalname)
        )
    }
})

const maxSize = 1 * 1024 * 1024

const upload = multer({
    storage : storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only JPG, PNG, & JPEG are allowed"));
        }
    },
    limits: { fileSize: maxSize },

    })

//Users
router.post("/register", upload.single("image"), userController.registerUser);
router.post("/login", userController.loginUser);

router.all('/*', global.auth.authenticate)
router.get("/get-Profile" , userController.getUserProfile)
router.put("/update-Profile" , upload.single("image"), userController.updateUserProfile)

// category
router.post("/create-category", categoryController.categorySave);
router.get("/get-categories-with-question", categoryController.categoryCountWithQuestionCount);
// question
router.post("/create-question", questionController.createQuestion);
router.get("/get-questions-by-category", questionController.getQuestionsByCategory);

//answer check
router.post("/submit-answer", userAnswerController.submitAnswer);
router.get("/user/answered/questions", userAnswerController.getUserAnsweredQuestions);

module.exports = router;