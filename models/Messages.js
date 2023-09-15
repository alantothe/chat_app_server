import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    seenBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
        },
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
messageSchema.virtual("detailedSender", {
  ref: "User",
  localField: "senderId",
  foreignField: "_id",
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
