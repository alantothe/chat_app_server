import mongoose from "mongoose";

const groupMessageSchema = mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupConversation',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    img: {
        type: String,
    },
})

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema)    

export default GroupMessage;

