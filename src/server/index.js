const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const server = require('http').Server(app);
const path = require('path');
// eslint-disable-next-line
const io = module.exports.io = require('socket.io')(server);
const mongoose = require('mongoose');
const cors = require('cors');
const SocketManager = require('./SocketManager');
const router = require('./router');

// App setup
app.use(bodyParser.json({ limit: 1024102420, type: '*/*' }));
app.use(express.static(path.resolve(__dirname, '/../../build')));
app.use(morgan('combined'));
app.use(cors());
router(app);

// Server setup
const port = process.env.PORT || 3230;
// eslint-disable-next-line
server.listen(port, function() {
  console.log('server is listening on port ' + port);
});

// Socket setup
io.on('connection', SocketManager);
module.exports.io = io;

// MongoDB setup
const uri = process.env.MONGODB_URI || 'mongodb://heroku_8hj6rv8b:3ocbcodkshfor1hhvvcquuoppj@ds117128.mlab.com:17128/heroku_8hj6rv8b';
mongoose.connect(uri);
