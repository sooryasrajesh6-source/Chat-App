const socket = io();

let username = "";

const loginBox = document.getElementById("loginBox");
const chatContainer = document.getElementById("chatContainer");
const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const userList = document.getElementById("userList");

const emojiBtn = document.getElementById("emojiBtn");
const emojiBox = document.getElementById("emojiBox");

const emojis = [
  "😀", "😃", "😄", "😁", "😆", "😂", "🤣", "😊",
  "😍", "🥰", "😘", "😎", "🤩", "😭", "😡",
  "👍", "👏", "🙌", "❤️", "💕", "💖", "🔥",
  "🎉", "🎊", "🚀", "💻", "📚", "🎮", "🎵", "⭐"
];

emojis.forEach((emoji) => {
  const span = document.createElement("span");
  span.textContent = emoji;

  span.addEventListener("click", () => {
    input.value += emoji;
    input.focus();
    emojiBox.style.display = "none";
  });

  emojiBox.appendChild(span);
});

emojiBtn.addEventListener("click", () => {
  emojiBox.style.display =
    emojiBox.style.display === "block" ? "none" : "block";
});

joinBtn.addEventListener("click", joinChat);

usernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    joinChat();
  }
});

function joinChat() {
  username = usernameInput.value.trim();

  if (username === "") {
    alert("Please enter your name");
    return;
  }

  socket.emit("join", username);

  loginBox.style.display = "none";
  chatContainer.style.display = "flex";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value.trim() !== "") {
    socket.emit("chat message", {
      user: username,
      text: input.value,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    });

    input.value = "";
  }
});

socket.on("chat message", (data) => {
  const li = document.createElement("li");

  if (data.user === username) {
    li.classList.add("sent");
  } else {
    li.classList.add("received");
  }

  li.innerHTML = `
    <div class="username">${data.user}</div>
    <div class="message">${data.text}</div>
    <div class="time">${data.time}</div>
  `;

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("system", (msg) => {
  const li = document.createElement("li");
  li.classList.add("system");
  li.textContent = msg;

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("userCount", (count) => {
  document.getElementById("onlineCount").innerText = `${count} Online`;
});

socket.on("userList", (users) => {
  userList.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `🟢 ${user.name}`;
    userList.appendChild(li);
  });
});
