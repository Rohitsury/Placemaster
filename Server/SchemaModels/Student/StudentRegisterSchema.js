const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken")

const StudentSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
    },
    usn:{
        type:String,
        required:true,
        validate: {
            validator: function(value) {
                return /^02[FEfe]/.test(value); 
            },
            message: 'USN must start with "02FE" or "02fe"'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    verified:{
        type:Boolean,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

// generate authtoken
StudentSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRETE_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err)
    {
        console.log(err)
    }
}

const admin = mongoose.model('Student_Register', StudentSchema)

module.exports = admin