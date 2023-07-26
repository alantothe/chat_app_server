import mongoose from "mongoose";

const emailPattern = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;

const userSchema = mongoose.Schema ({

    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20
    },  
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
        match: emailPattern, 
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
    },
    avatar: {  
        type: String,
        required: true,

    },
    friendRequest: {
        type: Array,
    },
    isOnline: {
        type: Boolean,
    },
    friends: {
        type: Array,
        required: true,
    },
})      

    
const User = mongoose.model("User", userSchema)

export default User