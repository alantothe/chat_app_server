import db from "./db/mongo.js";
import {Server} from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import routes from "./routes/index.js";

dotenv.config();
const PORT = process.env.PORT || 4000

const app = express();
const server = http.createServer(app); // 
const io = new Server(server); // attach the socket.io server to the HTTP server

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use("/api", routes);

io.on("connection", (socket) => {
  // send a message to the client
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

  // receive a message from the client
  socket.on("hello from client", (...args) => {
    // ...
  });
});

db.on("connected", () => {
  console.clear();
  console.log("Connected to MongoDB");
  server.listen(PORT, () => { // change app.listen to server.listen
    console.log(`Express server running on PORT: ${PORT}`);
  });
});
