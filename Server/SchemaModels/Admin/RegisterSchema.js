const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const jwt = require("jsonwebtoken")
const AdminSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
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

// generate authtoke

AdminSchema.methods.generateAuthToken = async function(){
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

const admin = mongoose.model('ADMINLOGIN', AdminSchema)

module.exports = admin