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
      path: "detailedLastMessageFrom",
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

export const fetchConversationByTwoMembers = async (req, res) => {
  const { member1, member2 } = req.body;
  try {
    const conversations = await Conversation.findOne({
      members: { $all: [member1, member2], $size: 2 },
    }).populate({
      path: "detailedMembers",
      model: "User",
      select: "firstName lastName avatar isOnline",
    });

    res.status(201).json({
      message: "Users is in the following Conversations!",
      conversations: conversations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const fetchConversationsByIdSingle = async (req, res) => {
  const { _id } = req.params;
  try {
    const conversations = await Conversation.find({
      members: _id,
      $expr: { $eq: [{ $size: "$members" }, 2] }, // only has 2 members
    })
      .populate({
        path: "detailedLastMessageFrom",
        model: "User",
        select: "firstName lastName avatar isOnline",
      })
      .populate({
        path: "detailedMembers",
        model: "User",
        select: "firstName lastName avatar isOnline",
      });

    res.status(201).json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const fetchGroupConversationsById = async (req, res) => {
  const { _id } = req.params;

  try {
    const conversations = await Conversation.find({
      members: _id,
      $expr: { $gt: [{ $size: "$members" }, 2] }, // more than 2 members
    })
      .populate({
        path: "detailedLastMessageFrom",
        model: "User",
        select: "firstName lastName avatar isOnline",
      })
      .populate({
        path: "detailedMembers",
        model: "User",
        select: "firstName lastName avatar isOnline",
      });

    res.status(201).json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const seenBy = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { _id } = req.body;

    if (!conversationId || !_id) {
      return res
        .status(400)
        .json({ error: "Conversation ID and User ID are required." });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    // check if the user has already marked the conversation as seen
    const hasSeen = conversation.lastSeenBy.some(
      (entry) => String(entry) === String(_id)
    );

    if (!hasSeen) {
      conversation.lastSeenBy.push(_id);
      await conversation.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Seen status updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
