import mongoose from "mongoose";

const friendRequestSchema = mongoose.Schema({
    requesterId: {
        type: String,
        required: true,
    },
    recipientId: {
        type: String,
        required: true,

    },
    status: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
})


const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema)

export default FriendRequest
