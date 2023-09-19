import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    lastMessage: String,
    lastMessageFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastSeenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

conversationSchema.virtual("detailedMembers", {
  ref: "User",
  localField: "members",
  foreignField: "_id",
});
conversationSchema.virtual("detailedLastMessageFrom", {
  ref: "User",
  localField: "lastMessageFrom",
  foreignField: "_id",
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
