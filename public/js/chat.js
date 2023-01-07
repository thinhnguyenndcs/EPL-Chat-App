const socket = io();

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);

const room = urlParams.get("room");
const username = urlParams.get("username");
let userId = "";

const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

socket.emit("join room", { room: room, username: username });

//Notify room that a client has joined
socket.on("a client joins/leaves room", (message) => {
  let contentHTML = document.getElementById("app__messages").innerHTML;
  contentHTML += `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">${message.username}</p>
                <p class="message__date">${message.sendingTime}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">${message.content}</p>
            </div>
        </div>`;
  document.getElementById("app__messages").innerHTML = contentHTML;
});

//Handle received user list
socket.on("send room info", (roomInfo) => {
  const { name, users } = roomInfo;
  document.getElementById("app__title2").innerHTML = name;
  let contentHTML = "";
  users.map((user) => {
    if (user.id === userId) {
      contentHTML += `<li class="app__item-user">${user.username} - You</li>`;
    } else {
      contentHTML += `<li class="app__item-user">${user.username}</li>`;
    }
  });
  document.getElementById("app__list-user--content").innerHTML = contentHTML;
});

//Handle received user info
socket.on("send user info", (userInfo) => {
  userId = userInfo.id;
});

//Handle received old message
socket.on("send old messages", (messages) => {
  console.log(messages);
  let contentHTML = document.getElementById("app__messages").innerHTML;
  for (let i = 0; i < messages.length; i++) {
    let d = new Date(messages[i].sendingTime);
    d =
      [padL(d.getDate()), padL(d.getMonth() + 1), d.getFullYear()].join("/") +
      " " +
      [padL(d.getHours()), padL(d.getMinutes()), padL(d.getSeconds())].join(
        ":"
      );
    contentHTML += `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">${messages[i].sender}</p>
                <p class="message__date">${d}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">${messages[i].message}</p>
            </div>
        </div>`;
    document.getElementById("app__messages").innerHTML = contentHTML;
    const messages_container = document.getElementById("app__messages");
    messages_container.scrollTop = messages_container.scrollHeight;
  }
});

//Send message
document.getElementById("form-messages").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const d = new Date();
  const message = {
    senderId: userId,
    senderName: username,
    content: formData.get("message"),
    sendingTime:
      [padL(d.getDate()), padL(d.getMonth() + 1), d.getFullYear()].join("/") +
      " " +
      [padL(d.getHours()), padL(d.getMinutes()), padL(d.getSeconds())].join(
        ":"
      ),
  };
  socket.emit("send message", message);
  let contentHTML = document.getElementById("app__messages").innerHTML;
  contentHTML += `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">You</p>
                <p class="message__date">${message.sendingTime}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">${message.content}</p>
            </div>
        </div>`;
  document.getElementById("app__messages").innerHTML = contentHTML;
  document.getElementById("input-messages").value = "";
  const messages_container = document.getElementById("app__messages");
  messages_container.scrollTop = messages_container.scrollHeight;
});

//Handle received message
socket.on("a client sends message", (message) => {
  let contentHTML = document.getElementById("app__messages").innerHTML;
  contentHTML += `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">${message.username}</p>
                <p class="message__date">${message.sendingTime}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">${message.content}</p>
            </div>
        </div>`;
  document.getElementById("app__messages").innerHTML = contentHTML;
  const messages_container = document.getElementById("app__messages");
  messages_container.scrollTop = messages_container.scrollHeight;
});
