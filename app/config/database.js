const mongoose = require('mongoose')

const URL = `mongodb+srv://${process.env.DB_HOST}/${process.env.DB_DATABASE}`;

let options = {
    auth: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  };

module.exports = async ()=>{
    try {
        await mongoose.connect(URL , options)
        console.log('DATABASE Connected Successfully ');
    } catch (error) {
        console.log(error);
    }
}