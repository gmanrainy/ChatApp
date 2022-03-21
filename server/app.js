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
    this.type = type
    this.data = data
  }

  toJson() {
    return {
      type: this.type,
      data: this.data
    }
  }
}

const knex = require('knex')({
  client: 'better-sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});

// Bad, не нужно сохранять как json
knex.schema.createTableIfNotExists('messages', function (table) {
  table.increments('id').primary().unsigned().notNullable()
  table.json('message')
  table.bigint('created_at')
}).then()

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// Отправка сообщений всем юзерам
function sendDataToAll(socket, type, data) {
  socket.emit(type, data)
  socket.broadcast.emit(type, data)
}

// Повторная отправка сообщений юзерам
function resendChatContent(socket) {
  knex('messages').select().orderBy('created_at', 'desc').then((messages) => {
    sendDataToAll(socket, 'messages', messages.map(value => JSON.parse(value.message)))
  })
}

// Сохраняем новые сообщения в базу
function saveChatContent(type, data, callback) {
  let chatContent = new ChatContent(type, data)
  knex('messages').insert({ message: chatContent.toJson(), created_at: new Date().getTime() }).then(callback)
}

io.on('connection', (socket) => {

  // Отправляет клиенту подтверждение о подключении
  socket.emit('connected')

  // Регистрируем эвенты
  socket.on('user:connected', (user) => {
    saveChatContent('notification', { type: 'connect', user: user }, ()=>{
      resendChatContent(socket)
    })
  })

  socket.on('user:disconnected', (user) => {
    saveChatContent('notification', { type: 'disconnect', user: user }, () => {
      resendChatContent(socket)
    })
  })

  socket.on('user:message', (message) => {
    message.uuid = uuidv4()
    message.date = new Date().getTime()

    saveChatContent('message', message, () => {
      resendChatContent(socket)
    })
  })
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

module.exports = app;
