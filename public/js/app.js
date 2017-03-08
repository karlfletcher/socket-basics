var socket = io();
var now = moment();

var name = getQueryVariable('name') || "Anon";
var room = getQueryVariable('room');

$('.room-name').text(room);

socket.on('connect', function(){
	console.log("Connected to socket.io server");
	socket.emit('joinRoom', {
		name: name,
		room: room
	})
});

socket.on('message', function(message){
	var momentTimestamp = moment.utc(message.timestamp);

	$('.messages').append("<li class='list-group-item'><strong>"+message.name+" "+momentTimestamp.local().format('H:mma')+":</strong> "+message.text+"</li>")
});

var $form = $('#message-form');

$form.on('submit', function(e){
	e.preventDefault();

	var message = $form.find('input[name="message"]').val();
	socket.emit('message', {
		text: message,
		timestamp: now.valueOf(),
		name: name
	});

	$form.find('input[name="message"]').val("").focus();
});