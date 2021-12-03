const socket = io();
const chatmessage = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//Get Username and room from URL
const {username,room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

//Join Chat Room
socket.emit('JoinRoom',{username,room});

//Message From Server
socket.on('msg',message=>{
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatmessage.scrollTop = chatmessage.scrollHeight;
})

//GetRoomUsers
socket.on('roomusers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);
})

chatForm.addEventListener('submit',(e)=>{
   e.preventDefault(); // it prevent the default action,i.e from submiting the event
 
   const msg = e.target.elements.msg.value; // get message text
   //console.log(msg);
   
   //Emit message to server
   socket.emit('chatMessage',msg);

   //clear input
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();
})


// Output message to DOM
const outputMessage = (message)=>{
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${ message.time}</span></p>
                   <p class="text"> ${message.text} </p>`;

  document.querySelector('.chat-messages').appendChild(div);                  
}

// Add Room name to DOM
const outputRoomName = (room)=>{
   roomName.innerText = room;
}

//Add users to DOM

const outputUsers = (users)=>{
   userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}


// //Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
