import { Server } from "socket.io";

function socketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // send a message to the client from server

    socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

    // receive a message from the client
    socket.on("hello from client", (data) => {
      console.log(`User ${data.data} connected with Socked ID: ${socket.id}`);
    });
  });

  return io;
}

export default socketServer;
