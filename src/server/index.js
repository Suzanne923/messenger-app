const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const server = require('http').Server(app);
const io = module.exports.io = require('socket.io')(server);
const mongoose = require('mongoose');
const cors = require('cors');

const SocketManager = require ('./SocketManager');
const router = require('./router');

// App setup
app.use(bodyParser.json({ type: '*/*' }));
app.use(express.static(__dirname + '/../../build'));
app.use(morgan('combined'));
app.options('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Content-Length, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.send(200);
});
router(app);

// Server setup
const port = process.env.PORT || 3230;
server.listen(port, function() {
  console.log('server is listening on port ' + port);
});

// Socket setup
io.on('connection', SocketManager);
module.exports.io = io;

// MongoDB setup
uri = process.env.MONGODB_URI;
mongoose.connect(uri);
