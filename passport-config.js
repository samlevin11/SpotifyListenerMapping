const SpotifyStrategy = require('passport-spotify').Strategy;
require('dotenv').config();

function initializePassport(passport) {
    passport.use(
        new SpotifyStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: 'http://localhost:' + process.env.PORT + process.env.AUTH_CALLBACK_PATH,
            },
            function (accessToken, refreshToken, expires_in, profile, done) {
                // console.log('accessToken', accessToken);
                // console.log('refreshToken', refreshToken);
                // console.log('expires_in', expires_in);
                // console.log('profile', profile);
                done(null, { accessToken, refreshToken, expires_in, profile });
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });
}

module.exports = initializePassport
