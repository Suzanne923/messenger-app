const io = require('./index.js').io;
const { VERIFY_USER, USER_CONNECTED, LOGOUT } = require('../events');
const { createUser, createMessage, createChat } = require('../factories');

let connectedUsers = { };

module.exports = function(socket) {
  console.log("Socket Id: " + socket.id);

  // Verify username
  socket.on(VERIFY_USER, (username, callback) => {
    if (isUser(connectedUsers, username)) {
      callback({ isUser: true, user: null });
    } else {
      callback({ isUser: false, user: createUser({ name: username })});
    }
  });

  // User connects with username
  socket.on(USER_CONNECTED, (user) => {
    console.log('io', io);
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;
    //io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });
  // User disconnects

  // User logouts

}

function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

function removeUser(userList, username) {
  let newLst = Object.assign({}, userList);
  delete newList(username);
  return newList;
}

function isUser(userList, username) {
  return username in userList;
}
