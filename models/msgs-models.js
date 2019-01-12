const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const msgSchema= new Schema({

    username: String,
    messages: String,
    timestamp: {type: Date, default: Date.now}
});

//setting up user model and collection , passing in schema for defining the structure of records
const Message = mongoose.model('message', msgSchema);

module.exports = Message