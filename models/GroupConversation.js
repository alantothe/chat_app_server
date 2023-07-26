import mongoose from "mongoose";

const groupConversationSchema = mongoose.Schema({
    members: {
        type: Array,
    },
    lastMessage: {
        type: String,
    },
    startTimestamp: {
        type: Date,
    },
})

const GroupConversation = mongoose.model("GroupConversation", groupConversationSchema)

export default GroupConversation

