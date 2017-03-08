var PORT = process.env.PORT || 3000;

var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var now = moment();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//Sends user list to provided socket
function sendCurrentUsers(socket){

	var info = clientInfo[socket.id];
	var users = [];
	
	if(typeof info == 'undefined'){
		return;
	}

	Object.keys(clientInfo).forEach(function(socketID){
		var userInfo = clientInfo[socketID];
		if(userInfo.room == info.room){
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'Server',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	})

}

io.on('connection', function(socket){
	console.log('User connected via socket.io!');

	socket.on('disconnect', function(){
		if(typeof clientInfo[socket.id] != "undefined"){
			socket.leave(clientInfo[socket.id].room);
			io.to(clientInfo[socket.id].room).emit('message', {
				name: "Server",
				text: clientInfo[socket.id].name  + " has left",
				timestamp: moment().valueOf()
			});
			delete(clientInfo[socket.id]);
		}
	});

	socket.on('joinRoom', function(req){
		
		clientInfo[socket.id] = req;

		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: "Server",
			text: req.name + " has joined.",
			timestamp: moment().valueOf()
		});
	})

	socket.on('message', function(message){
		
		if(message.text == "@currentUsers")
			sendCurrentUsers(socket);
		else
			io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.emit('message', {
		name: 'Server',
		text: "Welcome to chatty chat face",
		timestamp: now.valueOf()
	});
});


http.listen(PORT, function(){
	console.log("Server listening on port " + PORT + "...");
});