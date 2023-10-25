    const mongoose = require('mongoose')
    const Schema = mongoose.Schema;

    const StudentProfileSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true
        },
        usn: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        sem: {
            type: Number,
            required: true,
        },
        cgpa: {
            type: String,
            required: true
        },
        skills: {
            type: String,
            required: true
        },
        hobbies: {
            type: String,
            required: true
        },
        languagesknown: {
            type: String,
            required: true,
        },
        projects: [
            {
                year: {
                    type: Number,
                },
                title:{
                    type:String,
                },
                technology:{
                    type:String
                }
            }
        ],
        profileimg:{
            type:String,
            default:null
        },
        resume:{
            type:String
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },

    })


    const studentProfile = mongoose.model('Student_Profile', StudentProfileSchema)

    module.exports = studentProfile