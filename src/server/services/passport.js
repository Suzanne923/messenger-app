const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const config = require('../config');

// Create local Strategy
const localOptions = { usernameField: 'username' };
const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy, payload = JWT token
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) { console.log('jwt error ', err); return done(err, false); }

    if (user) {
      console.log('jwt found');
      // send username to response
      done(null, user);
    } else {
      console.log('jwt unauthorized');
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
