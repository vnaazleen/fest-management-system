const mongoose = require('mongoose')
const { Schema } = mongoose

const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    username: { type : String , unique : true, required : true},
    name: { type : String , required : true},
    college: { type : String , required : true},
    branch: { type : String ,  required : true},
    phone: { type : Number ,  required : true},
    password: {type: String},
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)

module.exports = User