const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');


const routes = require('./routes/chat-routes');
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
// const PORT = 3000;
app.set('view engine', 'ejs')
// app.use('/auth', routes);
app.listen(3000, () => {
    console.log('The robots are listening on port 3000')
} );

// set up routes

app.use('/auth', authRoutes);

// Home page route

app.get('/', (req, res) => {
    res.render('home');
});


// Login page route

app.get('/login', (req, res) => {
    res.render('login');
});
// Authentication route

app.get('/auth', (req, res) => {

})