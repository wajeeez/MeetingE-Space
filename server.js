const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");



const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
}

app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json("Game Running ")
  // res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room,name:req.params.name });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName,name) => {
    socket.join(roomId);
    setTimeout(() => {
      socket.to(roomId).broadcast.emit("user-connected", userId);
    }, 1000)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });

 
    // Server-side code
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      // Broadcast to other participants that the user has left
      socket.to(roomId).broadcast.emit("user-disconnected", socket.id);
    });


  });
});

server.listen(process.env.PORT || 3030);
