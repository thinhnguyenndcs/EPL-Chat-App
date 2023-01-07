let rooms_list = {
    room1: {
        name: "Mờ U",
        users: []
    },
    room2: {
        name: "Mờ C",
        users: []
    },
}

const getRoomInfo = (room) => rooms_list[room];

//const getUserById = (id, room) => user.find(user => user.id === id);

const addUser = (userInfo, room) => rooms_list[room].users.push(userInfo);

const removeUser = (id, room) => rooms_list[room].users = rooms_list[room].users.filter(user => user.id !== id);

module.exports = {
    getRoomInfo,
    //getUserById,
    addUser,
    removeUser
}