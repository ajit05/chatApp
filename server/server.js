const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage}=require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

//connection with client
io.on('connection', (socket) => {
  console.log('New user connected');
  //sending message to client
  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app')); 
  //sending message  to  other users except itself
  socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));

  
// responding to client with some manipulation
  socket.on('createMessage', (message,callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from,message.text));
    callback('Hello browser');    
  });

  socket.on('createLocationMessage',(coords)=>
  {    console.log(coords.latitude);
      io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
