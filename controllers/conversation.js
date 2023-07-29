import Conversation from "../models/Conversation.js"
import User from "../models/User.js"

export const createConversation = async (req,res) =>{
    const { memberIds } = req.body
  
    const conversation = new Conversation ({
      members: memberIds,
      lastMessage: null,
    });
  
    const savedConversation = await conversation.save();
    
    req.io.emit('new conversation', JSON.stringify(savedConversation));
  
    memberIds.forEach(async (id) => {
      await User.findByIdAndUpdate(
        id,
        { $push: { conversations: savedConversation._id } },
        { new: true }
      );
    });
  
    res.status(201).json({ message: 'Conversation Created!', conversation: savedConversation
 });
  
};