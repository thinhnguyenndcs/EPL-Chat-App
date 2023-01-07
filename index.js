const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const { createMessage } = require("./utils/create-message");
const { getRoomInfo, addUser, removeUser } = require("./utils/user");
const messageModel = require("./models/message.model");
const roomModel = require("./models/room.model");

//Initialize app
const app = express();

//Create public path
const publicPathDir = path.join(__dirname, "/public");
app.use(express.static(publicPathDir));

//Create server
const port = 8080;
const server = http.createServer(app);

//Create socket.io
const io = socketio(server);
io.on("connection", (socket) => {
  console.log("A new client connects");

  socket.on("join room", async ({ room, username }) => {
    socket.join(room);

    //Add user
    const userInfo = {
      id: socket.id,
      username,
    };
    addUser(userInfo, room);
    socket.emit("send user info", userInfo);
    io.to(room).emit("send room info", getRoomInfo(room));
    const messages = await messageModel.find({ room });
    socket.emit("send old messages", messages);

    //Send a notification that a client has joined the room
    socket
      .to(room)
      .emit(
        "a client joins/leaves room",
        createMessage(`${username} joins room`, "Admin")
      );

    //Send a client message to the room
    socket.on("send message", async (message) => {
      //const { username } = getUserById(socket.id);
      const { content, senderName, sendingTime } = message;

      //Push message to database
      try {
        const session = await mongoose.startSession();
        await session.startTransaction();
        const newMessage = await messageModel
          .create(
            [
              {
                message: content,
                room,
                sender: senderName,
              },
            ],
            { session }
          )
          .then((messages) => messages[0]);
        const roomInfo = await roomModel
          .findOne({ name: room })
          .session(session);
        roomInfo.messages.push(newMessage);
        await roomInfo.save();
        await session.commitTransaction();
        await session.endSession();
      } catch (error) {
        console.error(error);
      }

      socket
        .to(room)
        .emit(
          "a client sends message",
          createMessage(content, senderName, sendingTime)
        );
    });

    //Send a notification that a client has left the room
    socket.on("disconnect", () => {
      removeUser(socket.id, room);
      io.to(room).emit("send room info", getRoomInfo(room));
      // socket
      //   .to(room)
      //   .emit(
      //     "a client joins/leaves room",
      //     createMessage(`${username} leaves room`, "Admin")
      //   );
      console.log("A client leaves connection");
    });
  });
});

//Set server port
server.listen(port, () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(
      "mongodb+srv://thinhnguyen:Thinh123@chatapp.s3btgnr.mongodb.net/chat-app",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connect database successfully.");
  } catch (error) {
    console.log("Connect database failed.");
  }
  console.log("App run on port " + port);
});
