const socket = io()

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);

const room = urlParams.get('room');
const username = urlParams.get('username');

socket.emit('join room', {room: room, username: username});

document.getElementById('app__title2').innerHTML = room;

//Notify room that a client has joined
socket.on('a client joins room', (message) => {
    let contentHTML = document.getElementById('app__messages').innerHTML;
    contentHTML += `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">${message.username}</p>
                <p class="message__date">${message.date}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">${message.content}</p>
            </div>
        </div>`;
    document.getElementById('app__messages').innerHTML = contentHTML;
})

//Handle received user list
socket.on('send user list', (userList) => {
    let contentHTML = '';
    userList.map((user) => {
        if(user.username === username){
            contentHTML += `<li class="app__item-user">${user.username} - You</li>`
        }
        else{
            contentHTML += `<li class="app__item-user">${user.username}</li>`
        }
    })
    document.getElementById('app__list-user--content').innerHTML = contentHTML;
})

//Send message
document.getElementById('form-messages').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    socket.emit('send message', formData.get('message'));
    document.getElementById('input-messages').value = '';
})

//Handle received message
socket.on('a client sends message', (message) => {
    let contentHTML = document.getElementById('app__messages').innerHTML;
    contentHTML += `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">${message.username}</p>
                <p class="message__date">${message.date}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">${message.content}</p>
            </div>
        </div>`;
    document.getElementById('app__messages').innerHTML = contentHTML;
})