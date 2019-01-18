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
var query = Message.find({username: req.user.username}); 
  query.sort('-timestamp').limit(5).exec(
  (err, docs)=>{
    if(err){
      throw err;
    }else{
    
      console.log('here', docs)
     
        res.render('profile', {user: req.user, docs});

      
    }
  });
});

module.exports = router;