const uuidv4 = require('uuid/v4');

// createUser object
const createUser = ({ name = "", socketId = null } = {}) => ({
  id: uuidv4(),
  name,
  socketId
});

// createMessage object
const createMessage = ({ message = "", sender = "" } = {}) => ({
  id: uuidv4(),
  time: getTime(new Date(Date.now())),
  message,
  sender
});

// createChat object
const createChat = ({
  messages = [],
  name = "",
  users = []
} = {}) => ({
  id: uuidv4(),
  name,
  messages,
  users,
  typingUsers: []
});

const getTime = date => `${date.getHours()}:0${("0" + date.getMinutes()).slice(-2)}`;

module.exports = {
  createMessage,
  createChat,
  createUser
};
