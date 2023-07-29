import {Server} from "socket.io";

function socketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`A User connected with Socked ID: ${socket.id}`);
    // send a message to the client
    
    socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

    // receive a message from the client
    socket.on("hello from client", (...args) => {
      // ...
    });
  });

  return io

}

export default socketServer;
