import mongoose from "mongoose";

const groupConversationSchema = mongoose.Schema({
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

const GroupConversation = mongoose.model("GroupConversation", groupConversationSchema)

export default GroupConversation;
