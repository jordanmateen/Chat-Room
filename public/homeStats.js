const Message = require('./models/msgs-models')
const mongoose = require('mongoose');

console.log('This is working, inside bottom of home ejs file')

// find all athletes that play tennis
var query = Message.find();
console.log(query.messages);