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
        maxlength: 100,
    },
    avatar: {  
        type: String,
    },
    friendRequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isOnline: {
        type: Boolean,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    }],
})      

    
const User = mongoose.model("User", userSchema)

export default User