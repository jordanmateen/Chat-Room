// const express = require('../express');
// const app = express();
// const mongoose = require('mongoose');
// const keys = require('./config/keys');
// const Message = require('./models/msgs-models')
// const ReChoir = require('../require')
// const appTwo = require('../app');


// var theUser =  username;

console.log('This is working allMsg file')
// console.log('A human user logged in: ' + theUser );

// find all athletes that play tennis
var query = Message.find({ 'username': ' Another User' });
console.log(query.messages);

// selecting the 'name' and 'age' fields
query.select('messages');

// limit our results to 5 items
query.limit(5);

// sort by age
// query.sort({ age: -1 });

// execute the query at a later time
query.exec(function (err, messages) {
  if (err) return handleError(err);
  // athletes contains an ordered list of 5 athletes who play Tennis
  console.log(messages + 'go here')
 
});

// function yourMessages() {
//     var userMessages = Message.find( { username: "Another User"} );
//     console.log('this users messages are ' + userMessages);
// };
// yourMessages();

// Load previous messages
// socket.on('load previous messages', function(messages){

//     console.log(messages)
//     for(var i =docs.length -1; i >= 0 ; i--){
//         dsiplayMsgs(messages[i]);
//     }
// });

// var userMessages = Message.find( { username: 'Another User'} );
// console.log('this users messages are ' + userMessages);





