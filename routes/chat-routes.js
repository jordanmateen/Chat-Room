const chatRoutes = require('express').Router()


chatRoutes.get('/', (res, req) =>{
    res.render(chat)
});


chatRoutes.get('/login', (res,req)=>{
    res.render(login)
});


chatRoutes.get('/logout', (res,req)=>{
    //passport stuff
    res.send("logging out")
})


chatRoutes.get('/github-login-auth', (res,req)=>{
    //passport stuff
    res.send("log in with Git Hub")

});

module.exports = chatRoutes