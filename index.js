const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 4500;
const users = [{}];

app.get('/', (req, res)=>{
	res.send('Helllo server is working');
	
});
const server = http.createServer(app);

const io = socketIO(server);

io.on('connection',(socket)=>{
	console.log('connected');
	
	socket.on('joined',({user})=>{
		users[socket.id]=user;
		console.log(`${user} has joined`)
		socket.broadcast.emit('userJoined', {user:"admin", message:`${users[socket.id]} has joined`});
		socket.emit('welcome', {user:"admin", message:`welcome to the chat, ${users[socket.id]}`});
	})
	
socket.on('message', ({message, id})=>{
	io.emit('sendMessage',{user:users[id],message,id})
})
	
 socket.on('disconnect',()=>{
          socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
	
	
	
	
})

server.listen(port);