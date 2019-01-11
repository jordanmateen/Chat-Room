const express = require('express');
const app = express();
const routes = require('./routes/chat-routes');
const socket = require('socket.io')
const bodyParser = require ('body-parser');
const passport = require('passport');
var localStrategy = require('passport-local');

// Sequelize
const Sequelize = require('sequelize');

const sequelize = new Sequelize('chatroom', 'postgres', null, {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

});

//extablishing a db connection for the robotss
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully. The robots are pleased.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    console.log('ALERT HUMAN, make sure to make a db named chatroom, then retest.')

  });

// Set up view engine
const PORT = 3000;

//setting up view engine.
app.set('view engine', 'ejs')

// routes after auth
app.use('/auth', routes);

//prompting that the robots are listening.
var server = app.listen(PORT, () => {
  console.log(`The robots are listening on port ${PORT}`)
} );

//middleeare for accessing CSS
app.use(express.static('public'))


var io = socket(server);
//call function when connection is exstablished
io.on('connection', (socket)=>{
  console.log('Socket Connection', socket.id)

  socket.on('chat', function(data){
    // console.log(data);
    io.sockets.emit('chat', data);
  });

  
})


// Home page route

app.get('/home', (req, res) => {
    res.render('home');
});




