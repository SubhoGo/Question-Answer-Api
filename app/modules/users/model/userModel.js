const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.generatePassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// for validating the password
userSchema.methods.comparePassword = function (password, savedPassword) {
  return bcrypt.compareSync(password, savedPassword);
};

module.exports = mongoose.model("User", userSchema);
