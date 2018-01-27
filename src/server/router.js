const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const path = require('path');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  /*app.get('/chatbox', requireAuth, function(request, response) {
    console.log('require auth: ', requireAuth);
    //response.sendFile(path.resolve(__dirname + '/../../build/index.html'));
    response.sendStatus(500);
  });
  app.get('/login', function(request, response) {
    response.sendFile(path.resolve(__dirname + '/../../build/index.html'));
  });
  app.get('/register', function(request, response) {
    response.sendFile(path.resolve(__dirname + '/../../build/index.html'));
  });*/
  app.post('/login', requireLogin, Authentication.login);
  app.post('/register', Authentication.register);
}
