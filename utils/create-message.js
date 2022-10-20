const formatDate = require('date-format');

const createMessage = (message, username) => {
    return {
        username,
        content: message,
        date: formatDate('dd/MM/yyyy - hh:mm:ss', new Date())
    }
}

module.exports = {
    createMessage
}