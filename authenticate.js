// Load environment variables from .env
require('dotenv').config();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// Local strategy for username/password authentication
exports.local = passport.use(new LocalStrategy(User.authenticate()));

// For session-based auth (if needed)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Generate JWT token
exports.getToken = function(user) {
    return jwt.sign(user, process.env.secretKey, {
        expiresIn: 3600
    });
};

// JWT Strategy options
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretKey; // ✅ secret loaded from .env

// Passport JWT strategy
exports.jwtPassport = passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    })
);

// Middleware to verify user using JWT
exports.verifyUser = passport.authenticate('jwt', { session: false });

// Middleware to verify admin users
exports.verifyAdmin = function(req, res, next) {
    if (req.user && req.user.admin) {
        next();
    } else {
        var err = new Error('You are not authorized!');
        err.status = 403;
        return next(err);
    }
};
