const chatRoutes = require('express').Router()

//login route
chatRoutes.get('/login', (res,req)=>{
    res.render(login)
});

//logout route
chatRoutes.get('/logout', (res,req)=>{
    //passport stuff
    res.send("logging out")
})

//git hub route
chatRoutes.get('/github-login-auth', (res,req)=>{
    //passport stuff
    res.send("log in with Git Hub")

});

//chatroom routes
// chatRoutes.get('/chat', (req,res)=>{
//     console.log(`Method: ${req.method} \nURL: ${req.originalUrl}`)
//     res.render('chat')
// })

module.exports = chatRoutes