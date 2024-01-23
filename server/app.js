import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.use((socket, next) => {
  next();
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", ({ message, room }) => {
    // socket.broadcast.emit("receive-message", message);

    io.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  //   socket.emit("welcome", `Welcome to the server-${socket.id}`);
  //   socket.broadcast.emit("welcome", `${socket.id} joined the server`);
});

server.listen(3000, () => {
  console.log("Server is Runing in 3000");
});
