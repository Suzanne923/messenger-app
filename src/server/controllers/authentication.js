const User = require ('../models/user');
const jwt = require ('jwt-simple');
const config = require ('../config');
const path = require('path');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.avatar = (req, res, next) => {
  const username = req.get('Authorization');

  User.findOne({ username }, (err, user) => {
    if (err) { return next(err); }

    if (user) {
      const base64 = user.avatar.data;
      return res.send(base64);
    }
  });
}

exports.login = (req, res, next) => {
  // User has already had their username and password auth'd, we just need to give
  // them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.register = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const avatar = {
    data: req.body.data ||  'http://owlsmiths.com/media/default-user-image.png',
    contentType: req.body.type,
    filename: req.body.filename,
  };

  if (!username || !password) {
    return res.status(422).send({ error: "You must provide username, password" });
  }

  // see if a user with the given username exists
  User.findOne({ username }, (err, existingUser) => {
    if (err) { return next(err); }

    // if a user with username does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Username is in use' });
    }

    // if a user with username does NOT exist, create and save user record
    const user = new User({
      username,
      password,
      avatar
    });

    user.save(err => {
      if (err) { return next(err); }

      // respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}
