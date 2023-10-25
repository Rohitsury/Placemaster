const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PlacedStudentSchema = new Schema({
    studentname:{
        type:String,
        required:true
    },
    companyname:{
        type:String,
        required:true
    },
    branch:
    {
        type:String,
    },
    ctc:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    compimg:{
        type:String,
    },
})

const placedstudent = mongoose.model('PLACED_STUDENT',PlacedStudentSchema);

module.exports = placedstudent