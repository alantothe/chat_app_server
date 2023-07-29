import Messages from "../models/Messages.js"

export const createMessage =  async (req, res) => {

    let { conversationId, senderId, message, img   } = req.body

    try{

        const newMessage = new Messages ({
            conversationId,
            senderId,
            message, 
            img,




        })

        const messageSaved = await newMessage.save()

        // If all operations are successful
        res.status(201).json({ message: 'Message was sent successfully!', message: messageSaved });
    
    } catch (error) {
        // If any operation fails, send the error
        res.status(500).json({ error: error.message });
    }
}