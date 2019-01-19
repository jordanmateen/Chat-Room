//make connection
var socket = io.connect('http://localhost:3000')

//query DOM
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var button = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

var holder = document.getElementById("handle").placeholder;

handle.value = holder;

// Send message emit
button.addEventListener("click", function () {
    //emit message down the web socket to the server....sends object to server
    socket.emit("chat", {
        messages: message.value,
        username: handle.value
    });
    console.log('you are here');
    message.value = '';
});

//Button sends message

var btn = document.getElementById('message');
btn.onkeydown = function (e) {
    e = e || window.event;
    var keyCode = e.keyCode || e.which;
    if(keyCode==13) {
  //emit message down the web socket to the server....sends object to server
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
});
console.log('you are here');
message.value = '';
    }
};


message.addEventListener('keypress', () => {
    socket.emit('typing', handle.value);
})


//Lsiten for events
socket.on('chat', function (data) {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

//listen for typing 
socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing....</em></p>';
});

//listen for previous messages
socket.on('load previous notes', function (docs) {
    console.log(docs)
    for (var i = docs.length - 1; i >= 0; i--) {
        dsiplayMsgs(docs[i]);
    }

});

// listen for previous messages
socket.on("load previous notes", function (docs) {
    docs.forEach(displayMsg);
});

// display messages
function displayMsg(data) {
    // displays current user as "you" and person you are chatting with as their handle
    const isSender = data.username === handle.value;
    const username = isSender ? "you" : data.username
    const className = isSender ? "myMessage" : "theirMessage"
    output.innerHTML +=
        "<p id=\"message\" class=\"" + className + "\"><strong>" + username + ": </strong>" + data.messages + "</p>";
}