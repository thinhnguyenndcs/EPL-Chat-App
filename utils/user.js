let user = []

const getUser = (room) => user.filter(user => user.room === room);

const getUserById = (id) => user.find(user => user.id === id)

const addUser = (userInfo) => user.push(userInfo);

const removeUser = (id) => user = user.filter(user => user.id !== id);

module.exports = {
    getUser,
    getUserById,
    addUser,
    removeUser
}