const express = require('express');
const { homePage, signUpPage, signInPage, profilePage, createUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', homePage);

router.get('/signup', signUpPage);
router.post('/signup', createUser);

router.get('/signin', signInPage);

router.get('/profile', profilePage);


module.exports = router;