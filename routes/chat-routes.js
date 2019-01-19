const router = require('express').Router();

//Authentication Check.
const authCheck = (req, res, next) => {
    if(!req.user){
        // if user is not logged in
        res.redirect('/auth/login');
    } else {
        // if logged in call next 
        next();
    }
};

//chat route will enable able users have been authenticated.
router.get('/chat', authCheck, (req,res)=>{
    res.render('chat',{user: req.user })
})

//exporting module
module.exports = router;