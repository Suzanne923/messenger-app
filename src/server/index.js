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
app.use(cors());
app.options('/register', cors());
app.options('/login', cors());
app.options('/chatbox', cors());
app.options('*', cors());

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
