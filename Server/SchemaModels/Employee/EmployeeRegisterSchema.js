const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken")

const EmployeeSchema = new Schema({
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
EmployeeSchema.methods.generateAuthToken = async function(){
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

const employee = mongoose.model('Employee_Register', EmployeeSchema)

module.exports = employee