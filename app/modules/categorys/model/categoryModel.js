const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = new schema({
    name : {
        type : String,
        required : true,
        unique : true
    }
},
{
    versionKey : false,
    timestamps : true
})

module.exports = mongoose.model('Category',categorySchema);