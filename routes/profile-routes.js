//Requiring Modules
const router = require('express').Router();
const Message = require('../models/msgs-models')
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://chatroom:1chatroom@ds153824.mlab.com:53824/chatroom';

const mongoose = require('mongoose');



//Authentication Check 
const authCheck = (req, res, next) => {
    if(!req.user){
        // if user is not logged in
        res.redirect('/auth/login');
    } else {
        // if logged in call next 
        next();
    }
};



//profile route. 
router.get('/', authCheck, (req, res) => {
//Displaying the last five messages the user posted. sorted by time stamp most recent message will diplay at the top
var query = Message.find({username: req.user.username}); 
  query.sort('-timestamp').limit(5).exec(
  (err, docs)=>{
    if(err){
      throw err;
    }else{
      //Connecting to mongo. 
      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("chatroom");
          dbo.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log('profile routes ejs ' + result.length);              
          });
      }); 
      res.render('profile', {user: req.user, docs});
    }
  });
});

//Exporting Module
module.exports = router;