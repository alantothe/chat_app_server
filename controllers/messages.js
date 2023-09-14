import Messages from "../models/Messages.js";
import Conversation from "../models/Conversation.js";

export const createMessage = async (req, res) => {
  let { senderId, recipientId, message, img } = req.body;

  try {
    // check if there's an existing conversation between the two users
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, recipientId], $size: 2 },
    });

    //  if no conversation exists, create one
    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, recipientId],
        lastMessage: message, // set message
      });
      await conversation.save();
    } else {
      // update the last message for the existing conversation
      conversation.lastMessage = message;
      await conversation.save();
    }

    // create the new message and link it to the conversation
    const newMessage = new Messages({
      conversationId: conversation._id,
      senderId,
      message,
      img,
    });

    const messageSaved = await newMessage.save();

    // req.io.emit("new message", JSON.stringify(messageSaved));

    res.status(201).json({
      message: "Message was sent successfully!",
      messageData: messageSaved,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessagesBetweenTwo = async (req, res) => {
  const { member1, member2 } = req.body;

  try {
    // find the conversation between the two users
    const conversation = await Conversation.findOne({
      members: { $all: [member1, member2], $size: 2 },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "No conversation found between the specified users.",
      });
    }

    //  all messages linked to the found conversation ids
    const messages = await Messages.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 }); // sort by creation time, oldest first

    res.status(200).json({
      message: "Messages fetched successfully.",
      messages: messages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
