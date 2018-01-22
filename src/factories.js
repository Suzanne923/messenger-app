const uuidv4 = require('uuid/v4');

// createUser object
const createUser = ({ name = "" } = {}) => ({
  id: uuidv4(),
  name
});

// createMessage object
const createMessage = ({ message = "", sender = "" } = {}) => ({
  id: uuidv4(),
  time: getTime(new Date(Date.now())),
  message,
  sender
});

// createChat object
const createChat = ({ message = [], name = "", users = [] } = {}) => ({
  id: uuidv4,
  name,
  messages,
  users,
  typingUsers: []
});

const getTime = (date) => {
  return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
};

module.exports = {
  createMessage,
  createChat,
  createUser
}
