const router = require('express').Router();

// auth login 

router.get('/login', (req, res) => {
    res.render('login');
});

// auth logout

router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});


// auth with Google

router.get('/google',(req, res) => {
    // handle with passport

    res.send('logging in with Google');
});

// auth with local

router.get('/local',(req, res) => {
    // handle with passport

    res.send('logging in with local');
});

module.exports = router;
