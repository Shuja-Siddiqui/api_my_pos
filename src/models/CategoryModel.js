const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    name :{
     type: String,
    required: true
},
})  

const CategoryModel = new mongoose.model("Category", categorySchema)

module.exports={CategoryModel}