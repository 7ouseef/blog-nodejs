const mongoose=require('mongoose');
const Validator=require('validator');

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        validator: Validator.isEmail
    },
    password:{
        type: String,
        required:true,
        minLength: 5
    }
});

const User=mongoose.model('User',userSchema);

module.exports=User;
