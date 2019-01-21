const express = require('express');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');
const Message = require('./models/msgs-models');
const User = require('./models/user-model');
const profileRoutes = require('./routes/profile-routes');
const coookieSession = require('cookie-session');
const got = require('got');
const routes = require('./routes/auth-routes');
const chatRoute = require('./routes/chat-routes');
const socket = require('socket.io')
const passportSetup = require('./config/passport-setup');


const passport = require('passport');




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
app.use('/profile', profileRoutes);

//prompting that the robots are listening.
var server = app.listen(PORT, () => {
  console.log(`The robots are listening on port ${PORT}`)
});

//connect to mongodb 
mongoose.connect(keys.mongodb.dbURI, {
  useNewUrlParser: true
}, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Connected to Database')
  }
});

//middleeare for accessing CSS
app.use(express.static('public'))


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
    });


  socket.on('chat', function (data) {
    //accessing model and saving it to the database
    var newMessage = new Message(data);
    newMessage.save((err) => {
      if (err) {
        throw err;
      } else {
        io.sockets.emit('chat', data);
      }
    })

  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data)
  });



})

// set up routes

// Home page route important stuff happens here! 
// 1st - does the home page route!
// 2nd - checks to see if user is logged in
// 3rd - does all the neat counts on the home page. 

/// NEW HOME ROUTE 


app.get('/', async (req, res) => {


  var linesOfCode = await got('https://api.codetabs.com/v1/loc?github=jordanmateen1991/Chat-Room', {
    json: true
  })

  var numOfUsers = await User.countDocuments();
  var numOfMsgs = await Message.countDocuments();
  res.render('home', {
    user: req.user,
    numOfUsers,
    numOfMsgs,
    totalLines: linesOfCode.body[5].linesOfCode
  });

});

app.get('/login', (req, res) => {
  res.render('login');
});