const express = require('express');
const http =require('http');
const socketio = require('socket.io');
const formatmessage = require('./utils/message');
const user = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set Static folder
app.use(express.static(`${__dirname}`));

const PORT = 3000|| process.env.PORT;
const botname = 'Chiti';
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

//Run When client Connects
io.on('connection',socket=>{
   // console.log(socket);
 
   // socket.emit : it emits a msg to the single client, which is connecting
   //socket.broadcast.emit : it emits a msg to all the client except the client which is connecting
   // to emit to everybody we use io.emit
   
   socket.on('JoinRoom',({username,room})=>{
    
    const currentuser = user.userJoin(socket.id,username,room);
    socket.join(currentuser.room);  

    socket.emit('msg',formatmessage(botname,`${username} Welcome to Our ChatApp!`)); // Welcome the current user

    socket.broadcast.to(currentuser.room).emit('msg',formatmessage(botname,`${username} has joined the chat`)); // Broadcast when a user connects
    
    //Send users and room info
    io.to(currentuser.room).emit('roomusers',{
        room: currentuser.room,
        users : user.getRoomUser(currentuser.room)
    });

   })
  
   

   //Listen For Chat Message
   socket.on('chatMessage',(msg)=>{
       const currentuser = user.getCurrentUser(socket.id);
      io.to(currentuser.room).emit('msg',formatmessage(`${currentuser.username}`,msg));
   })

   socket.on('disconnect',()=>{
     const currentuser = user.userLeave(socket.id);

     if(currentuser)
      io.to(currentuser.room).emit('msg',formatmessage(botname,`${currentuser.username} has left the chat`));
      
        //Send users and room info
        io.to(currentuser.room).emit('roomusers',{
        room: currentuser.room,
        users : user.getRoomUser(currentuser.room)
    })
    })

});