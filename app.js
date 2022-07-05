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

passport.use(
    new SpotifyStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: CALLBACK_URI,
        },
        function (accessToken, refreshToken, expires_in, profile, done) {
            console.log('accessToken', accessToken)
            User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
                return done(err, user);
            });
        }
    )
);

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

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
