const router = require('express').Router();




router.get('/chat', (req,res)=>{
    res.render('chat',{user: req.user })
})


module.exports = router;