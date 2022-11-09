const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    return res.render('index');
});

router.get('/signup', (req, res) =>{
    return res.render('signup');
});

router.get('/signin', (req, res) => {
    return res.render('signin');
});

router.get('/profile', (req, res) => {
    return res.render('profile');
});


module.exports = router;