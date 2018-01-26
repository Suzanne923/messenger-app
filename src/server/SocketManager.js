const io = require('./index.js').io;
const { USER_CONNECTED, USER_DISCONNECTED, LOGOUT, COMMUNITY_CHAT,
  MESSAGE_RECEIVED, MESSAGE_SENT, TYPING, PRIVATE_MESSAGE } = require('../events');
const { createUser, createMessage, createChat } = require('../factories');

let connectedUsers = { };

let communityChat = createChat({ name: "Community" });

module.exports = function(socket) {

  let sendMessageToChatFromUser;
  let sendTypingFromUser;

  socket.on(USER_CONNECTED, (username) => {
    const user = createUser({ name: username, socketId: socket.id });
    if (!isUser(connectedUsers, user.name) && user.name !== null) {
      connectedUsers = addUser(connectedUsers, user);
      socket.user = user;
      sendMessageToChatFromUser = sendMessageToChat(user.name);
      sendTypingFromUser = sendTypingToChat(user.name);
      io.emit(USER_CONNECTED, connectedUsers);
      console.log('connected users: ', Object.keys(connectedUsers));
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log('user disconnected');
    }
  })
  // User logouts
  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, connectedUsers);
    console.log('user disconnected');
  })

  //Get Community Chat
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  })

  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message);
  })

  socket.on(TYPING, ({ chatId, isTyping}) => {
    sendTypingFromUser(chatId, isTyping);
  })

  socket.on(PRIVATE_MESSAGE, ({ receiver, sender, activeChat }) => {
    if(receiver in connectedUsers) {
      const newChat = createChat({ name: receiver, users: [receiver, sender] });
      const receiverSocket = connectedUsers[receiver].socketId;
      socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
      socket.emit(PRIVATE_MESSAGE, newChat);
    }
  })

  //separate function for adding user;
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
