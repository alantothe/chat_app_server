import Messages from "../models/Messages.js";
import Conversation from "../models/Conversation.js";

export const createMessage = async (req, res) => {
  let { senderId, recipientIds, message, img } = req.body;

  // Convert to array if a string is passed in
  recipientIds = Array.isArray(recipientIds) ? recipientIds : [recipientIds];

  try {
    const members = [senderId, ...recipientIds];

    // Check if there's an existing conversation between the members
    let conversation = await Conversation.findOne({
      members: { $all: members, $size: members.length },
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = new Conversation({
        members: members,
        lastMessage: message,
        lastMessageFrom: senderId,
        lastSeenBy: [senderId],
      });
      await conversation.save();
    } else {
      // Update the last message for the existing conversation
      conversation.set({
        lastMessage: message,
        lastSeenBy: [senderId],
        lastMessageFrom: senderId,
      });
      await conversation.save();
    }

    // Create the new message and link it to the conversation
    const newMessage = new Messages({
      conversationId: conversation._id,
      senderId,
      message,
      img,
      seenBy: [
        {
          userId: senderId,
          timestamp: Date.now(),
        },
      ],
    });

    const messageSaved = await newMessage.save();

    // Emit the entire conversation object with detailed members
    if (conversation) {
      // Populate detailed members and last message sender details
      await conversation.populate("detailedMembers");

      for (let recipientId of recipientIds) {
        // Get the socket id for each recipient
        let recipientSocketId = req.io.userSocketMap.get(recipientId);
        if (recipientSocketId) {
          req.io
            .to(recipientSocketId)
            .emit("message sent", { data: conversation });
        }
      }
    } else {
      console.error("Conversation is not defined");
    }

    // Return a response with the message, the saved message data, and detailed members
    res.status(201).json({
      message: "Message was sent successfully!",
      messageData: messageSaved,
      members: conversation.detailedMembers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessagesForMembers = async (req, res) => {
  const { members } = req.body;

  if (!members || members.length < 2) {
    return res.status(400).json({
      message: "Provide at least two members.",
    });
  }

  try {
    // find the conversation between the provided users
    const conversation = await Conversation.findOne({
      members: { $all: members, $size: members.length },
    });

    if (!conversation) {
      return res.status(200).json([]); // an empty array if no conversation found
    }

    // retrieve all messages linked to the found conversation ID
    const messages = await Messages.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: 1 })
      .populate({
        path: "detailedSender",
        model: "User",
        select: "firstName lastName avatar isOnline",
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchMessages = async (req, res) => {
  const searchTerm = req.query.q;

  try {
    const messages = await Message.find({
      message: new RegExp(searchTerm, "i"),
    });
    const conversationIds = messages.map((msg) => msg.conversationId);

    // Fetch unique conversations based on the found messages
    const conversations = await Conversation.find({
      _id: { $in: conversationIds },
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Error searching messages" });
  }
};
