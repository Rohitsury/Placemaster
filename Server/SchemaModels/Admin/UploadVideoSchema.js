const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UploadVideoSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    video:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const uploadvideo = mongoose.model('Uploaded_Videos',UploadVideoSchema);

module.exports = uploadvideo