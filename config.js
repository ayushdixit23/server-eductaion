const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const connectedUsers = {};

io.on('connection', (socket) => {
	console.log('A user connected');
	const userId = socket.handshake.query.userId;
	console.log(userId)
	if (userId && userId != "undefined") {
		connectedUsers[userId] = socket.id;
		console.log(connectedUsers)
		io.emit("onlineusers", Object.keys(connectedUsers));
	}

	socket.on('disconnect', () => {

		// const userId = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.id);
		// if (userId) {
		// 	delete connectedUsers[userId];
		// 	io.emit("onlineusers", Object.keys(connectedUsers));
		// // }
		console.log('User disconnected');
	});
});
console.log(connectedUsers, "online user")

function getReceiverUserIdSocket(receiverId) {
	return connectedUsers[receiverId]
}

module.exports = { io, server, app, getReceiverUserIdSocket }