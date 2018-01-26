const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/../../build/index.html');
  });
  app.get('/login', (req, res, next) => {
    res.sendFile(__dirname + '/../../build/index.html');
  });
  app.get('/register', (req, res, next) => {
    res.sendFile(__dirname + '/../../build/index.html');
  });
  app.get('/chatbox', (req, res, next) => {
    res.sendFile(__dirname + '/../../build/index.html');
  })
  app.post('/login', requireLogin, Authentication.login);
  app.post('/register', Authentication.register);
}
