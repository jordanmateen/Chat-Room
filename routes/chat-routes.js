const router = require('express').Router();




router.get('/chat', (req,res)=>{
    res.render('chat')
})


module.exports = router;