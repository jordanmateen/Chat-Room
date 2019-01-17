const express = require('express');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');
const Message = require('./models/msgs-models')
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const coookieSession = require('cookie-session');


const routes = require('./routes/auth-routes');
const chatRoute = require('./routes/chat-routes');
const socket = require('socket.io')

const bodyParser = require ('body-parser');
const passport = require('passport');
var localStrategy = require('passport-local');


// Set up view engine
const PORT = 3000;

//setting up view engine.
app.set('view engine', 'ejs')

app.use(coookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

  // initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  

// routes after auth
app.use('/auth', routes);
app.use(chatRoute);
//prompting that the robots are listening.
var server = app.listen(PORT, () => {
  console.log(`The robots are listening on port ${PORT}`)
} );

//connect to mongodb 
mongoose.connect(keys.mongodb.dbURI,{ useNewUrlParser: true }, (err)=>{
  if(err){
    throw err;
  }else{
    console.log('Connected to Database')
  }
}); 

//middleeare for accessing CSS
app.use(express.static('public'))


var io = socket(server);
//call function when connection is exstablished
io.on('connection', (socket)=>{
  console.log('Socket Connection', socket.id)

  //reciving messages on connection
  var query = Message.find({}); 
  query.sort('-timestamp').limit(5).exec(
  (err, docs)=>{
    if(err){
      throw err;
    }else{
      //console.log('These are old messages', docs);
      socket.emit('load previous notes', docs);
    }
  });


  socket.on('chat', function(data){
    console.log(data);
    
    //accessing model and saving it to the database
    var newMessage = new Message({
      username: data.handle,
      messages: data.message
    });
    newMessage.save((err)=>{
      if(err){
        throw err;
      }else{
        io.sockets.emit('chat', data);
      }
    })
    
  });

  socket.on('typing', (data)=>{
    socket.broadcast.emit('typing', data)
  });


  
})



// Moving these to above to test.

// app.use(coookieSession({
//   maxAge: 24 * 60 * 60 * 1000,
//   keys: [keys.session.cookieKey]
// }));

//   // initialize passport
//   app.use(passport.initialize());
//   app.use(passport.session());

// connect to mongodb




// set up routes

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);


// Home page route

app.get('/', (req, res) => {
    res.render('home', {user: req.user });
});


// Login page route

app.get('/login', (req, res) => {
    res.render('login');
});

// var userMessages = Message.find( { username: "Another User"} );
//   console.log('this users messages are ' + userMessages);



console.log('This is working, inside bottom of app file')

// find all athletes that play tennis
var query = Message.find({ 'username': 'Another User' });
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
  console.log('these are posts ' + messages)
 
});

 
 