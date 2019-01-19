// make connection
var socket = io.connect("http://localhost:3000");

// query DOM
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var button = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var holder = document.getElementById("handle").placeholder;

handle.value = holder;

// Send message emit
button.addEventListener("click", function() {
  //emit message down the web socket to the server....sends object to server
  socket.emit("chat", {
    messages: message.value,
    username: handle.value
  });

  message.value = "";
});

message.addEventListener("keypress", () => {
  socket.emit("typing", handle.value);
});

// Listen for events
socket.on("chat", function(data) {
  feedback.innerHTML = "";
  displayMsg(data);
});

// listen for typing
socket.on("typing", function(data) {
  feedback.innerHTML = "<p><em>" + data + " is typing....</em></p>";
});

// listen for previous messages
socket.on("load previous notes", function(docs) {
  docs.forEach(displayMsg);
});

// display messages
function displayMsg(data) {
  output.innerHTML +=
    "<p><strong>" + data.username + ": </strong>" + data.messages + "</p>";
}
