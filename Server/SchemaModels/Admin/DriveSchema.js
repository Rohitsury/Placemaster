const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DriveSchema = new Schema({
    companyname:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    branch:[
        {
            type:String,
            default:false
        }
    ],
    eligibility:{
        type:String,
    },
    ctc:{
        type:String,
    },
    passyear:{
        type:Number,
    },
    joblocation:{
        type:String,
    },
    jobrole:{
        type:String,
    },
    registerbefore:{
        type:Date
    },
    drivedate:{
        type:Date,
    },
    reglink:{
        type:String,
    },
    compimg:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const drive = mongoose.model('DRIVE',DriveSchema);

module.exports = drive