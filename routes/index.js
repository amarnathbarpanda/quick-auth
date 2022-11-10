const express = require('express');
const { homePage, signUpPage, signInPage, profilePage, createUser, signinUser, checkAuth, logout } = require('../controllers/userController');
const router = express.Router();

router.get('/', homePage);

router.get('/signup', signUpPage);
router.post('/signup', createUser);

router.get('/signin', signInPage); 
router.post('/signin', signinUser); 

router.get('/profile', checkAuth, profilePage);
router.get('/logout', logout);


module.exports = router;