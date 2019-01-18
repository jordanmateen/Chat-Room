//Requiring all modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');
const Message = require('./models/msgs-models')
const profileRoutes = require('./routes/profile-routes');
const coookieSession = require('cookie-session');
const got = require('got');
const routes = require('./routes/auth-routes');
const chatRoute = require('./routes/chat-routes');
const socket = require('socket.io')
const passport = require('passport');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://chatroom:1chatroom@ds153824.mlab.com:53824/chatroom';

const passportSetup = require('./config/passport-setup');
var localStrategy = require('passport-local');
const request = require('request');





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
  

//Middleware for routes
app.use(chatRoute);
app.use('/auth', routes);
app.use('/profile', profileRoutes);
//Middleware for accessing CSS
app.use(express.static('public'))

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

var io = socket(server);
//call function when connection is exstablished
io.on('connection', (socket)=>{
  console.log('Socket Connection', socket.id)

  /**
   * querying the db in for all data. sorting the data by the time stamp most recent message appears at the bottom
   */
  var query = Message.find({}); 
  query.sort('-timestamp').limit(5).exec(
  (err, docs)=>{
    if(err){
      throw err;
    }else{
      for(var i = 0; i < docs.length; i++){
        console.log(`${docs[i].username} posted ${docs[i].messages} on ${docs[i].timestamp}`);
      }
      //emmitting data back to the ui
      socket.emit('load previous notes', docs);
    }
  });


  //on start of chat this callback will fire using the data recived it stores the messages into the model in the db
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
        //emitting messages on chat event
        io.sockets.emit('chat', data);
      }
    })
  });

  //broadcasting messages from individual socket
  socket.on('typing', (data)=>{
    socket.broadcast.emit('typing', data)
  });
})


// HOME ROUTE 
app.get('/', (req, res) => {
  
  var collections = []
  //connecting to db client to get data for display on home page
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var database = db.db("chatroom");
    
    //Promise query for counting documents inside the users collection in the database { unresolved here }
    var users = database.collection('users').countDocuments();
    collections.push(users);

    //Promise query for countintg the docuemnts in the messages collection in the database. { unresolved here }
    var messages = database.collection('messages').countDocuments();
    collections.push(messages);

    //api for getting git repo
    var linesOfCode = got('https://api.codetabs.com/v1/loc?github=jordanmateen1991/Chat-Room', { json: true })
    collections.push(linesOfCode);

    //resolving all promises 
    Promise.all(collections).then((count) =>{
      console.log(`Total users: ${count[0]}\nTotal Messages ${count[1]}\nLines of code ${count[2].body[6].linesOfCode}`);
      res.render('home', {user: req.user, numOfUsers:count[0], numOfMsgs: count[1], totalLines: count[2].body[6].linesOfCode });
    })
  })
});

//login route
app.get('/login', (req, res) => {
    res.render('login');
});

 