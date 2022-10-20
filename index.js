const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const {createMessage} = require('./utils/create-message');
const {getUser, getUserById, addUser, removeUser} = require('./utils/user');

//Initialize app
const app = express();

//Create public path
const publicPathDir = path.join(__dirname, '/public');
app.use(express.static(publicPathDir));

//Create server
const port = 8080;
const server = http.createServer(app);

//Create socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('A new client connects');

    socket.on('join room', ({room, username}) => {
        socket.join(room);

        //Add user
        const userInfo = {
            id: socket.id,
            room,
            username,
        }
        addUser(userInfo);
        io.to(room).emit('send user list', getUser(room));

        //Send a notification that a client has joined the room
        socket.to(room).emit('a client joins room', createMessage(`${username} joins ${room}`, 'Admin'));

        //Send a client message to the room
        socket.on('send message', (message) => {
            const {username} = getUserById(socket.id);
            io.to(room).emit('a client sends message', createMessage(message, username));
        })
        
        //Send a notification that a client has left the room
        socket.on('disconnect', () => {
            removeUser(socket.id);
            io.to(room).emit('send user list', getUser(room));
            console.log('A client leaves connection');
        })
    })
})

//Set server port
server.listen(port, () => {
    console.log('App run on port ' + port);
});