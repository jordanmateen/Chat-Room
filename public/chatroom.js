//make connection

var socket = io.connect('http://localhost:3000')

//query DOM
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var button = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

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

message.addEventListener('keypress' ,()=>{
    socket.emit('typing', handle.value);
})


//Lsiten for events
socket.on('chat', function(data){
    feedback.innerHTML ='';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';

    //console.log(output);
});

//listen for typing 
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' +data + ' is typying....</em></p>';

});
//listen for previous messages
socket.on('load previous notes', function(docs){

    console.log(docs)
    for(var i =docs.length -1; i >= 0 ; i--){
        dsiplayMsgs(docs[i]);
    }
});


//dsiplay messages
function dsiplayMsgs(data){
    output.innerHTML += '<p><strong>' + data.username + ': </strong>' + data.messages + '</p>';
}