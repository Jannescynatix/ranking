const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/reviews/dashboard',
    failureRedirect: '/'
}));

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;