import Conversation from "../models/Conversation.js"
import User from "../models/User.js"

export const createConversation = async (req,res) =>{
    const { memberIds } = req.body
  
    const conversation = new Conversation ({
      members: memberIds,
      lastMessage: null,
    });
  
    const savedConversation = await conversation.save();
  
    memberIds.forEach(async (id) => {
      await User.findByIdAndUpdate(
        id,
        { $push: { conversations: savedConversation._id } },
        { new: true }
      );
    });
  
    res.status(201).json({ message: 'Conversation Created!', conversation: savedConversation
 });
  
  

    // Push the new friend request's ID into the recipient's friendRequest array
    const user1Updated = await User.findByIdAndUpdate(
        user1Id,
        { $push: { conversations: conversationSaved._id } },
        { new: true }
        );

    const user2Updated = await User.findByIdAndUpdate(
            user2Id,
            { $push: { conversations: conversationSaved._id } },
            { new: true }
            );
     // If all operations are successful, send the updated recipient data
     res.status(201).json({ message: 'Conversation Creeated!!', recipient: user1Updated, user2Updated  });


};