var PORT = process.env.PORT || 3000;

var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var now = moment();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket){
	console.log('User connected via socket.io!');

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