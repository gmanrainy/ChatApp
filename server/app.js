const express = require('express');
const app = express();
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    credentials: false
  }
});
const PORT = 3001

class ChatContent {
  constructor(type, data) {
    this.type = type,
    this.data = data
  }
}

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// Тут должна быть бд :)
const chatData = []

// Отправка сообщений всем юзерам
function sendDataToAll(socket, type, data) {
  socket.emit(type, data)
  socket.broadcast.emit(type, data)
}

io.on('connection', (socket) => {

  // Отправляет клиенту подтверждение о подключении
  socket.emit('connected')

  // Регистрируем эвенты
  socket.on('user:connected', (user) => {
    chatData.push(new ChatContent('notification',  { type: 'connect', user: user }))
    sendDataToAll(socket, 'messages', chatData)
  })

  socket.on('user:disconnected', (user) => {
    chatData.push(new ChatContent('notification',  { type: 'disconnect', user: user }))
    sendDataToAll(socket, 'messages', chatData)
  })

  socket.on('user:message', (message) => {
    // Генерируем уникальный id сообщения
    message.uuid = uuidv4()
    // Добавляем новое сообщение
    chatData.push(new ChatContent('message',  message))
    // Отправляем всем новые сообщения
    sendDataToAll(socket, 'messages', chatData)
  })
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

module.exports = app;
