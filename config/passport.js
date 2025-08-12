const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            User.findOne({ username: username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Benutzername nicht gefunden' });
                    }
                    bcrypt.compare(password, user.password)
                        .then(isMatch => {
                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, { message: 'Falsches Passwort' });
                            }
                        })
                        .catch(err => done(err));
                })
                .catch(err => done(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
};