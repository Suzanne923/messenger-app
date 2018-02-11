const io = require('./index.js').io;

const { USER_CONNECTED, USER_DISCONNECTED, LOGOUT, COMMUNITY_CHAT,
MESSAGE_SENT, MESSAGE_RECEIVED, TYPING, PRIVATE_MESSAGE,
NEW_USER_ADDED, USER_REMOVED } = require('../events');

const { createUser, createMessage, createChat } = require('../factories');

let connectedUsers = { };

let communityChat = createChat({ name: "Community" });

module.exports = function(socket) {

  let sendMessageToChatFromUser;
  let sendTypingFromUser;

  // User connects to socket with username
  socket.on(USER_CONNECTED, (username) => {
    const user = createUser({ name: username, socketId: socket.id });
    if (user.name !== null) {
      connectedUsers = addUser(connectedUsers, user);
    }
    socket.user = user;

    sendMessageToChatFromUser = sendMessageToChat(user);
    sendTypingFromUser = sendTypingToChat(user);

    io.emit(USER_CONNECTED, user, connectedUsers);
    console.log('connected users: ', Object.keys(connectedUsers));
  });

  // User disconnects
  socket.on('disconnect', () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      io.emit(USER_DISCONNECTED, Object.keys(connectedUsers));
    }
  });

  // User logouts
  socket.on(LOGOUT, () => {
    socket.disconnect();
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, Object.keys(connectedUsers));
    console.log('user disconnected');
  });

  //Get Community Chat
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  });

  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message);
  });

  socket.on(TYPING, ({ chatId, isTyping}) => {
    sendTypingFromUser(chatId, isTyping);
  });

  socket.on(PRIVATE_MESSAGE, ({ receiver, sender }) => {
    if(receiver in connectedUsers) {
      const receiverSocket = connectedUsers[receiver].socketId;
      const newChat = createChat({ name: receiver, users: [connectedUsers[receiver], connectedUsers[sender] ]});
      socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
      socket.emit(PRIVATE_MESSAGE, newChat);
    }
  });

  socket.on(NEW_USER_ADDED, ({ newUser, activeChat}) => {
    if (!(activeChat.users.includes(connectedUsers[newUser]))) {
      const receiverSocket = connectedUsers[newUser].socketId;
      socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);
      activeChat.users
        .map(u => connectedUsers[u.name])
        .forEach(u => {
          socket.to(u.socketId).emit(NEW_USER_ADDED, activeChat.id, connectedUsers[newUser]);
        });
    }
  });

  socket.on(USER_REMOVED, ({ user, activeChat}) => {
    if (user in connectedUsers) {
      const receiverSocket = connectedUsers[user].socketId;
      if (activeChat.id !== communityChat.id) {
        activeChat.users
          .filter(u => u.name !== user)
          .map(u => connectedUsers[u.name])
          .forEach(u => {
            socket.to(u.socketId).emit(USER_REMOVED, user);
          });
      }
    }
  });
}

function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, {user, isTyping});
  }
}

function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }));
  }
}

function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

function removeUser(userList, username) {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}

function isUser(userList, username) {
  return username in userList;
}
