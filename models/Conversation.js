import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    lastMessage: String,
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
