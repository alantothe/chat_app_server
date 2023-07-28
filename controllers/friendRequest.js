import FriendRequest from "../models/FriendRequest.js"
import User from "../models/User.js"
export const sendFriendRequest = async(req, res) => {

    const {requesterId, recipientId } = req.body
    try {
        // Create new friend request
        const newFriendRequest = new FriendRequest({
            requesterId,
            recipientId,
            status: 'pending'
        });
    
        // Save the new friend request
        const friendRequestSaved = await newFriendRequest.save();
    
        // Push the new friend request's ID into the recipient's friendRequest array
        const recipientUpdated = await User.findByIdAndUpdate(
            recipientId,
            { $push: { friendRequest: friendRequestSaved._id } },
            { new: true }
        );
    
        // If all operations are successful, send the updated recipient data
        res.status(201).json({ message: 'Friend Request was sent successfully!', recipient: recipientUpdated });
    
    } catch (error) {
        // If any operation fails, send the error
        res.status(500).json({ error: error.message });
    }



}

export const friendRequestAccepted = async(req, res) => {

    const { friendRequestID, response, requesterId, recipientId } = req.body
    if (response == "accepted"){
    try{
        const updateFriendRequest = await FriendRequest.findByIdAndUpdate(
            friendRequestID,
            { $set: { status: "accepted" } },
            { new: true })

        const addRequesterId = await User.findByIdAndUpdate(
            requesterId,
            {$push:{ friends:recipientId  } },
            { new: true }
        )
        const addRecipientId = await User.findByIdAndUpdate(
            recipientId,
            { $push: { friends: requesterId }, $pullAll: { friendRequest: [friendRequestID] } },
            { new: true });
        // If all operations are successful, send the updated recipient data
        res.status(201).json({ message: 'Friend Request was sent successfully!', update: updateFriendRequest, add:addRequesterId, removeAndAdd: addRecipientId,  });

     
    }catch (error) {
        // If any operation fails, send the error
        res.status(500).json({ error: error.message });
    }

}
}


export const friendRequestRejected = async(req, res) => {

    const { friendRequestID, response, recipientId } = req.body
    if (response == "rejected"){
    try{
        const updateFriendRequest = await FriendRequest.findByIdAndUpdate(
            friendRequestID,
            { $set: { status: "rejected" } },
            { new: true })


        const addRecipientId = await User.findByIdAndUpdate(
            recipientId,
            { $pullAll: { friendRequest: [friendRequestID] } },
            { new: true });
        // If all operations are successful, send the updated recipient data
        res.status(201).json({ message: 'Friend Request was Rejected successfully!', update: updateFriendRequest, add: addRecipientId,  });

     
    }catch (error) {
        // If any operation fails, send the error
        res.status(500).json({ error: error.message });
    }

}
}