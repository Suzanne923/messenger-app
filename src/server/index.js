const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const SocketManager = require ('./SocketManager');

const app = express();

// App setup
app.use(bodyParser.json({ type: '*/*' }));

// Server setup
const port = process.env.PORT || 3231;
const server = http.Server(app);
server.listen(port, function() {
  console.log('server is listening on port ' + port);
});

const io = socket(server);
io.on('connection', SocketManager);

app.use(express.static(__dirname + '/../../build'));

/* Socket setup
const io = socket(server);
io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('send message', function(message) {
    console.log(message);
    io.emit('receive message', message);
  });
});*/
