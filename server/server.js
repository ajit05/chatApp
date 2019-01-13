const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation')
const {User}=require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users=new User();
app.use(express.static(publicPath));

//connection with client
io.on('connection', (socket) => {
  console.log('New user connected');
  //sending message to all client
 
///join chat

socket.on('join',(params,callback)=>
{
  if(!isRealString(params.name) || !isRealString(params.room))
  {
    return  callback('name and room are required');
  }
   socket.join(params.room);
   users.removeUser(socket.id);
     console.log('id='+socket.id+" name="+params.name+" room="+params.name)
   users.addUser(socket.id,params.name,params.room);
   console.log('user successfully added');
   io.to(params.room).emit('updateUserList',users.getUserList(params.room));
  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app')); 
  //sending message  to  other users except itself
  socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined `));
   callback();
});

  
// responding to client with some manipulation
socket.on('createMessage', (message, callback) => {
  var user = users.getUser(socket.id);
  console.log('user id while responding to client='+user.id+"user.name="+user.name);
  if (user && isRealString(message.text)) {
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
  }
 // io.emit('newMessage', generateMessage(message.from,message.text));
  callback();
});

  socket.on('createLocationMessage',(coords)=>
  {    console.log(coords.latitude);
      var user=users.getUser(socket.id);
      if(user)
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
    var user=users.removeUser(socket.id);
    if(user)
    {
      io.to(user.room).emit('updateUserList',users.getUserList(users.room));
      io.to(user.room).emit('newMessage',generateMessage(`${user.name} has left the chat`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
 //io.emit --> this funtion emits every user connected to room
   //socket.broadcast.emit ---> this send message to every conntd user except current user
  // socket.emit --> one to one  connection