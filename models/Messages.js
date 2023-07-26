import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    img: {
        type: String,
    },
})


const Message = mongoose.model("Message", messageSchema)    

export default Message

