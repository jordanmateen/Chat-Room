const express = require('express');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');
const Message = require('./models/msgs-models')
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');

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
io.on('connection', async (socket) => {
  // emit message history on connection
  Message.find({}).sort('-timestamp').limit(5).exec((error, result) => {
    if (error) {
      throw error
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