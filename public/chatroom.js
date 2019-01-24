//make connection
var socket = io.connect("http://localhost:3000" || "http://quiet-waters-86169.herokuapp.com");

//query DOM
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var button = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var holder = document.getElementById("handle").placeholder;

handle.value = holder;

//Emitting Event

button.addEventListener("click", function () {
    sendMessage();
});

//Button sends message

var btn = document.getElementById("message");
btn.onkeydown = function (e) {
    e = e || window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == 13) {
        sendMessage();
    }
};

message.addEventListener("keypress", () => {
    socket.emit("typing", handle.value);
});

function sendMessage() {
    socket.emit("chat", {
        messages: message.value,
        username: handle.value
    });
    message.value = "";
}

//Lsiten for events
socket.on("chat", function (data) {
    feedback.innerHTML = "";
    displayMsg(data);
    console.log(data);
});

//listen for typing
socket.on("typing", function (data) {
    feedback.innerHTML = "<p><em>" + data + " is typing....</em></p>";
});

// listen for previous messages
socket.on("load previous notes", function (docs) {
    docs.reverse().forEach(displayMsg);
    
});

// display messages
function displayMsg(data) {
    // displays current user as "you" and person you are chatting with as their handle
    const isSender = data.username === handle.value;
    const username = isSender ? "you" : data.username;
    const className = isSender ? "myMessage myMessageBg" : "theirMessage theirMessageBg";
    output.innerHTML +=
        '<p id="message" class="' +
        className +
        '"><strong>' +
        username +
        ": </strong>" +
        data.messages +
        "</p>";
    console.log();
}