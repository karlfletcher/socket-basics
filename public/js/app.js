var socket = io();

socket.on('connect', function(){
	console.log("Connected to socket.io server");
});

socket.on('message', function(message){
	$('.messages').append("<p> >"+message.text+"</p>")
});

var $form = $('#message-form');

$form.on('submit', function(e){
	e.preventDefault();

	var message = $form.find('input[name="message"]').val();
	socket.emit('message', {
		text: message
	});

	$form.find('input[name="message"]').val("").focus();
});