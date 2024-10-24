const User = require('../model/userModel')

const userRepo = {

    // Register user
  register: async (data) => {
       
    try {
      console.log("data", data);
      const existingUser = await User.findOne({ email: data.email });
      console.log("existingUser", existingUser);
      if (existingUser) {
        return {
          status: 409,
          message: "User already exists",
        };
      } else {
        console.log("data", data);
        
        const user = new User(data);
        user.password = user.generatePassword(data.password);
        
        const saveUser = await User.create(user);
        if (!saveUser) {
          return {
            status: 400,
            message: "User not saved",
          };
        }
        return {
          status: 200,
          message: "User saved successfully",
          data: saveUser,
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        error: error.message,
      };
    }
  },

  //login user
  login: async (data) => {
    try {
      const user = await User.findOne({ email: data.email });
      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }
      const isMatch = user.comparePassword(data.password, user.password);
      if (!isMatch) {
        return {
          status: 400,
          message: "Invalid password",
        };
      } else {
        return {
          status: 200,
          message: "User logged in successfully",
          data: user,
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        error: error.message,
      };
    }
  },

  //get user profile
  getUserProfile : async (id) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                return {
                    status: 404,
                    message: "User not found",
                };
            }
            return {
                status: 200,
                message: "User profile fetched successfully",
                data: user,
            };
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
                error: error.message,
            };
        }
    },

 //update user profile
 updateUserProfile : async (id, data) => {
        try {
            const user = await User.findByIdAndUpdate(id, data, { new: true });
            if (!user) {
             return {
                    status: 404,
                    message: "User not found",
                };
            }
            return {
                status: 200,
                message: "User profile updated successfully",
                data: user,
            };
        } catch (error) {
        return {
            status: 500,
            message: "Internal server error",
            error: error.message,
        };
    }
}


}
module.exports = userRepo