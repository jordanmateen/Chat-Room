const router = require('express').Router();
const Message = require('../models/msgs-models')
const mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://chatroom:1chatroom@ds153824.mlab.com:53824/chatroom';




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
var query = Message.find({username: req.user.username}); 
  query.sort('-timestamp').limit(5).exec(
  (err, docs)=>{
    if(err){
      throw err;
    }else{
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("chatroom");
            dbo.collection("users").find({}).toArray(function(err, result2) {
              if (err) throw err;
              var totalMsg = result2.length;
              console.log('profile routes ejs ' + result2.length);              
            });
          }); 


      console.log('here', docs)
     
        res.render('profile', {user: req.user, docs});

      
    }
  });
});



module.exports = router;