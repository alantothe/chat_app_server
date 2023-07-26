import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    startTimestamp: {
        type: Date,
        default: Date.now,
    },
})

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation;


