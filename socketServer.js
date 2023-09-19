import { Server } from "socket.io";

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
