import mongoose from "mongoose";

const friendRequestSchema = mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, {
    timestamps: true 
})

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema)

export default FriendRequest;
