const express = require('express');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passport-config');

require('dotenv').config();
port = process.env.PORT;

initializePassport(passport);

const app = express();

app.use(pathLogger);

app.use(
    session({
        secret: '46^ubGeCF!$bpFxDbq9A',
        resave: true,
        saveUninitialized: true,
    })
);

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    console.log('USER INFO', req.user);
    if (req.user) {
        const displayName = req.user.profile.displayName;
        res.send(`Welcome ${displayName}!!`);
    } else {
        res.send('app root');
    }
});

app.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
        scope: ['user-follow-read'],
        showDialog: true,
    })
);

app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

function pathLogger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
