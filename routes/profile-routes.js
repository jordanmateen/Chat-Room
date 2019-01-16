const router = require('express').Router();
const Message = require('../models/msgs-models')
const mongoose = require('mongoose');



const authCheck = (req, res, next) => {
    if(!req.user){
        // if user is not logged in
        res.redirect('/auth/login');
    } else {
        // if logged in call next 
        next();
    }
};




router.get('/', authCheck, (req, res) => {
    var messagesArray;
    
    console.log("I AM THE USER", req.user.username)
    var userMessages = Message.find({ username: req.user.username}).limit(5)
    .then(function(result) {
        messagesArray = result
        console.log(messagesArray);
    }).catch(function(e) {
        console.log(e)
    });
    setTimeout(function() {
        res.render('profile', {user: req.user, message: messagesArray[0].messages });
    }, 1000)
    
    // console.log(userMessages)

    // for(i=0; i < userMessages.length; i++) {

    // }
    console.log('profile ejs users messages are ' + userMessages ) ;
    console.log('hello world this is working');
    // console.log(userMessages[1]);
    // console.log('%j', userMessages)

});


module.exports = router;