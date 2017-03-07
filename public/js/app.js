var socket = io();
var now = moment();

socket.on('connect', function(){
	console.log("Connected to socket.io server");
});

socket.on('message', function(message){
	var momentTimestamp = moment.utc(message.timestamp);
	$('.messages').append("<p> <strong>"+momentTimestamp.local().format('H:mma')+":</strong> "+message.text+"</p>")
});

var $form = $('#message-form');

$form.on('submit', function(e){
	e.preventDefault();

	var message = $form.find('input[name="message"]').val();
	socket.emit('message', {
		text: message,
		timestamp: now.valueOf()
	});

	$form.find('input[name="message"]').val("").focus();
});