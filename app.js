const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;

require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URI = process.env.CALLBACK_URI;

const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

app.use(logger);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.use(
    session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new SpotifyStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: CALLBACK_URI,
        },
        function (accessToken, refreshToken, expires_in, profile, done) {
            console.log('accessToken', accessToken);
            done(null, accessToken);
        }
    )
);

app.get('/', (req, res) => {
    res.send('app root');
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

app.get('/loggedin', (req, res) => {
    res.send('LOGGED IN.');
});

function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
