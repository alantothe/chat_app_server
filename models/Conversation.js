import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
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


const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation

