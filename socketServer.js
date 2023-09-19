import { Server } from "socket.io";
import Message from "./models/Messages.js";
import Conversation from "./models/Conversation.js";

// Maintain a mapping of userId to socket.id
let userSocketMap = new Map();

function socketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // handle setting of user's socket
    socket.on("set-user", (userIdObject) => {
      const actualUserId = userIdObject.data;
      userSocketMap.set(actualUserId, socket.id);
      console.log(
        `User ${actualUserId} connected with Socket ID: ${socket.id}`
      );
    });
    socket.on("search", async (searchTerm) => {
      try {
        // get the user ID from the userSocketMap using socket.id
        const userId = [...userSocketMap.entries()]
          .filter(([_, socketId]) => socketId === socket.id)
          .map(([userId, _]) => userId)[0];

        if (!userId) {
          console.error("User ID not found for socket:", socket.id);
          return;
        }

        const messages = await Message.find({
          message: new RegExp(searchTerm, "i"),
        }).populate("conversationId");

        const conversationIds = messages.map((msg) =>
          msg.conversationId._id.toString()
        );

        // fetch conversations that match the search and include the user as a member
        const conversations = await Conversation.find({
          _id: { $in: conversationIds },
          members: userId,
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

        socket.emit("searchResults", conversations);
      } catch (error) {
        console.error("Error handling search event:", error);
      }
    });

    socket.on("disconnect", () => {
      // delete user from the mapping on disconnect
      for (let [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });

  // attach the userSocketMap to io so it can be accessed in the middleware
  io.userSocketMap = userSocketMap;

  return io;
}

export default socketServer;
