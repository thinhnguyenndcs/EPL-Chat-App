const formatDate = require("date-format");

const createMessage = (message, username, sendingTime) => {
  if(!sendingTime){
    sendingTime = formatDate("dd/MM/yyyy hh:mm:ss", new Date());
  }
  return {
    username,
    content: message,
    sendingTime,
  };
};

module.exports = {
  createMessage,
};
