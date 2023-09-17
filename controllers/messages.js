import Message from "../models/Messages.js";
import Conversation from "../models/Conversation.js";

export const createMessage = async (req, res) => {
  let { senderId, recipientIds, message, img } = req.body;
  // below will convert to array if a string is passed in
  recipientIds = Array.isArray(recipientIds) ? recipientIds : [recipientIds];

  try {
    const members = [senderId, ...recipientIds];

    // check if there's existing conversation between the members
    let conversation = await Conversation.findOne({
      members: { $all: members, $size: members.length },
    });

    // if no conversation exists, create one
    if (!conversation) {
      conversation = new Conversation({
        members: members,
        lastMessage: message,
        lastMessageFrom: senderId,
        unreadCount: members.map((memberId) => ({
          userId: memberId,
          count: memberId === senderId ? 0 : 1,
        })),
      });
      await conversation.save();
    } else {
      // update the last message for the existing conversation
      conversation.lastMessage = message;

      // increment unread count for all recipients
      for (let recipientId of recipientIds) {
        let recipientUnread = conversation.unreadCount.find(
          (uc) => String(uc.userId) === String(recipientId)
        );
        if (recipientUnread) {
          recipientUnread.count += 1;
        } else {
          // This shouldn't happen normally, but just in case
          conversation.unreadCount.push({ userId: recipientId, count: 1 });
        }
      }

      await conversation.save();
    }

    // create the new message and link it to the conversation
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

    // Emit the entire conversation object
    if (conversation) {
      req.io.emit("message sent", { data: conversation });
    } else {
      console.error("Conversation is not defined");
    }
    res.status(201).json({
      message: "Message was sent successfully!",
      messageData: messageSaved,
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
    const messages = await Message.find({
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

export const seenBy = async (req, res) => {
  try {
    const { messageId, userId } = req.body;

    if (!messageId || !userId) {
      return res
        .status(400)
        .json({ error: "Message ID and User ID are required." });
    }

    // update the message document
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    // check if the user has already seen the message
    const hasSeen = message.seenBy.some(
      (seen) => String(seen.userId) === String(userId)
    );

    if (!hasSeen) {
      message.seenBy.push({
        userId,
        timestamp: new Date(),
      });
      await message.save();
    }

    //update last seen message
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation) {
      const userLastSeen = conversation.lastSeenMessage.find(
        (entry) => String(entry.userId) === String(userId)
      );
      if (userLastSeen) {
        userLastSeen.messageId = messageId;
      } else {
        conversation.lastSeenMessage.push({
          userId,
          messageId,
        });
      }
      await conversation.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Seen status updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
