const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passport-config');

require('dotenv').config();
port = process.env.PORT;

initializePassport(passport);

app.set('view-engine', 'ejs');

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
    res.send('app root');
});

app.get('/home', (req, res) => {
    console.log('USER', req.user);
    const displayName = req.user.profile.displayName;
    res.render('home.ejs', { displayName });
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
        res.redirect('/home');
    }
);

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

// function checkNotAuthenticated(req, res, next) {
//     // if (req.isAuthenticated()) {
//     //     return next();
//     // } else
//     console.log('isAuthenticated', req.isAuthenticated())
//     if (req.isAuthenticated()) {
//         res.redirect('/auth/spotify');
//     }
//     return next();
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect('/');
//     }
//     next();
// }

function pathLogger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
