const express = require('express');
const passport = require('passport');
const { homePage, signUpPage, signInPage, profilePage, createUser, signinUser, checkAuth, logout, google, googleCallBack, sendVerificationEmail, verifyEmail, forgotPassword, forgotPasswordPage, resetPassword, resetPasswordPage } = require('../controllers/userController');
const router = express.Router();

router.get('/', homePage);

router.get('/signup', signUpPage);
router.post('/signup', createUser);

router.get('/signin', signInPage); 
router.post('/signin', signinUser); 

router.get('/profile', checkAuth, profilePage);
router.get('/logout', logout);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
}), googleCallBack);

// routes for user verification
router.get('/user/send-verification-email', checkAuth, sendVerificationEmail)

router.get('/user/verifyEmail', verifyEmail);

router.get('/user/forgot-password', forgotPasswordPage);
router.post('/user/forgot-password', forgotPassword);

router.get('/user/reset-password', resetPasswordPage);
router.post('/user/reset-password', resetPassword);

module.exports = router;