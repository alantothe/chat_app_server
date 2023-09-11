import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const createConversation = async (req, res) => {
  const { memberIds } = req.body;

  const conversation = new Conversation({
    members: memberIds,
    lastMessage: null,
  });

  const savedConversation = await conversation.save();

  req.io.emit("new conversation", JSON.stringify(savedConversation));

  memberIds.forEach(async (id) => {
    await User.findByIdAndUpdate(
      id,
      { $push: { conversations: savedConversation._id } },
      { new: true }
    );
  });

  res.status(201).json({
    message: "Conversation Created!",
    conversation: savedConversation,
  });
};

export const fetchConversationById = async (req, res) => {
  const { id } = req.params;
  try {
    const conversations = await Conversation.find(id).populate({
      path: "detailedMembers",
      model: "User",
      select: "firstName lastName avatar isOnline",
    });

    res.status(201).json({
      message: "User is in the following Conversations!",
      conversations: conversations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
