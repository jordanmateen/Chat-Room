const express = require('express');
const app = express();
const routes = require('./routes/chat-routes');
const bodyParser = require ('body-parser');

const PORT = 3000;
app.set('view engine', 'ejs')
app.use('/auth', routes);



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});