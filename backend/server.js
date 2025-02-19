const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://cart-rabbit-fawn.vercel.app/"],
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
    socket.on("leave_room", (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
    });
    
});

server.listen(5000, () => console.log("Server running on port 5000"));
