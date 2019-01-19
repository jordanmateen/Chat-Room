const express = require('express');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');
const Message = require('./models/msgs-models')
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');

const coookieSession = require('cookie-session');
const got = require('got');
const request = require('request');



const routes = require('./routes/auth-routes');
const chatRoute = require('./routes/chat-routes');
const socket = require('socket.io')

const bodyParser = require('body-parser');
const passport = require('passport');
var localStrategy = require('passport-local');


// connect to mongodb 
mongoose.connect(keys.mongodb.dbURI, {
  useNewUrlParser: true
}, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Connected to Database')
  }
});

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://chatroom:1chatroom@ds153824.mlab.com:53824/chatroom';

var db = 'mongodb://chatroom:1chatroom@ds153824.mlab.com:53824/chatroom';




const PORT = 3000;

// setting up view engine.
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// routes after auth
app.use('/auth', routes);
app.use(chatRoute);
app.use('/profile', profileRoutes);

// Home page route
app.get('/', (req, res) => {
  res.render('home', {
    user: req.user
  });
});

// Login page route
app.get('/login', (req, res) => {
  res.render('login');
});

// prompting that the robots are listening.
var server = app.listen(PORT, () => {
  console.log(`The robots are listening on port ${PORT}`)
});

var io = socket(server);

//call function when connection is established
io.on('connection', (socket) => {
  console.log('Socket Connection', socket.id)

  //reciving messages on connection
  var query = Message.find({});
  query.sort('-timestamp').limit(5).exec(
    (err, docs) => {
      if (err) {
        throw err;
      } else {

        for (var i = 0; i < docs.length; i++) {
          console.log(`${docs[i].username} posted ${docs[i].messages} on ${docs[i].timestamp}`);

        }

        socket.emit('load previous notes', docs);


      }
      socket.emit('load previous notes', result);
    });

  socket.on('chat', function (data) {
    // save message
    new Message(data).save(error => {
      if (error) {
        throw error
      }

      io.sockets.emit('chat', data);
    });
  });

  // typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data)
  });


  console.log('Socket Connection', socket.id)
});



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

// Home page route important stuff happens here! 
// 1st - does the home page route!
// 2nd - checks to see if user is logged in
// 3rd - does all the neat counts on the home page. 

/// NEW HOME ROUTE 


app.get('/', (req, res) => {

  var collections = []
  //connecting to db client to get data for display on home page
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var database = db.db("chatroom");
    var users = database.collection('users').countDocuments();
    collections.push(users);

    var messages = database.collection('messages').countDocuments();
    collections.push(messages);

    var linesOfCode = got('https://api.codetabs.com/v1/loc?github=jordanmateen1991/Chat-Room', {
      json: true
    })
    collections.push(linesOfCode);


    Promise.all(collections).then((count) => {
      console.log(`Total users: ${count[0]}\nTotal Messages ${count[1]}`);
      res.render('home', {
        user: req.user,
        numOfUsers: count[0],
        numOfMsgs: count[1],
        totalLines: count[2].body[5].linesOfCode
      });
    })


  })
});