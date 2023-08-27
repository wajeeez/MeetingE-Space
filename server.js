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

// app.get("/", (req, res) => {

//  res.redirect(`/${uuidv4()}`);
// });
app.get("/:classId", (req, res) => {
  res.render("room", { classId: req.params.classId });
});
// app.get("/:room", (req, res) => {
//   res.render("room", { roomId: req.params.room });
// });

io.on("connection", (socket) => {
  socket.on("join-room", (classId, userId, userName) => {
    socket.join(classId);
    setTimeout(()=>{
      socket.to(classId).broadcast.emit("user-connected", userId);
    }, 1000)
    socket.on("message", (message) => {
      io.to(classId).emit("createMessage", message, userName);
    });
  });
});

server.listen(process.env.PORT || 3030);
