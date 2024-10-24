const User = require('../repositories/userRepositories')
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "MERN2024-2025";

class userController {

    //register user
        async registerUser(req, res) {
        // console.log("req.body", req.body);
        // console.log(req.file);
        
        const {name, email, password} = req.body;
        const image = req.file
        const userData = {
            name,
            email,
            password,
            image: image.filename
        }
        try {
          // req.body = req.body.toLowerCase();
          const saveData = await User.register(userData);
          
          if (saveData.status === 200) {
            return res.status(200).send({
              message: saveData.message,
              data: saveData.data,
            });
          } else if (saveData.status === 404) {
            return res.status(404).send({
              message: saveData.message,
            });
          } else if (saveData.status === 409) {
            return res.status(409).send({
              message: saveData.message,
            });
          }
        } catch (error) {
          return {
            status: 500,
            message: "Internal server error",
            error: error.message,
          };
        }
        }
    
      //login user
      async loginUser(req, res) {
        try {
          req.body = req.body;
          const saveData = await User.login(req.body);
          if (saveData.status === 404) {
            return res.status(404).send({
              message: saveData.message,
            });
          } else if (saveData.status === 400) {
            return res.status(400).send({
              message: saveData.message,
            });
          } else if (saveData.status === 200) {
            const token = jwt.sign(
              {
                id: saveData.data._id,
                email: saveData.data.email,
              },
              secret,
              { expiresIn: "2D" }
            );
            res.cookie("token :", token);
            return res.status(200).send({
              message: saveData.message,
              data: saveData.data,
              token: token,
            });
          }
        } catch (error) {
          return {
            status: 500,
            message: "Internal server error",
            error: error.message,
          };
        }
        }
    
    //get user profile
    async getUserProfile(req,res){
        try {
            const user = await User.getUserProfile(req.user.id);
            if (user.status === 200) {
                return res.status(200).send({
                  message: user.message,
                  data: user.data,
                });
              } else if (user.status === 404) {
                return res.status(404).send({
                    message: user.message,
                  });
              }
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
                error: error.message,
              };
        }
    }
    

    //update user profile
    async updateUserProfile(req,res){
        try {
            const {name, email, password} = req.body;
            const image = req.file
            const userData = {
                name,
                email,
                password,
                image: image.filename
            }
            const user = await User.updateUserProfile(req.user.id, userData);
            if (user.status === 200) {
                return res.status(200).send({
                  message: user.message,
                  data: user.data,
                });
              } else if (user.status === 404) {
                return res.status(404).send({
                    message: user.message,
                  });
              }
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
                error: error.message,
              };
        }
    }

}

module.exports = new userController();
