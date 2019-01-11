//make connection

var socket = io.connect('http://localhost:3000')

//query DOM
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var button = document.getElementById('send');
var output = document.getElementById('output');

//Emitting Event

button.addEventListener('click', function(){
    //emit message down the web socket to the server....sends object to server
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });

    console.log('you are here');

    message.value = '';
    //handle.value = '';
});


//Lsiten for events
socket.on('chat', function(data){

    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    console.log(output);
});
