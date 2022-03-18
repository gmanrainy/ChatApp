import './App.css';
import React, { useEffect, useState, useRef } from "react";
import { useBeforeunload } from 'react-beforeunload';

const { v4: uuidv4 } = require('uuid');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001', {
  withCredentials: false,
  autoConnect: false
});

var username = 'Guest'

class Message {
  constructor(username, userSessionId, message, date) {
    this.username = username
    this.userSessionId = userSessionId
    this.message = message
    this.date = date
  }
}

class User {
  constructor(uuid, username) { 
    this.uuid = uuid
    this.username = username
  }
}

function App() {
  const [message, setMessage] = useState('')
  const [chatContent, setChatContent] = useState([])
  const [connected, setConnected] = useState(false)
  const [userSessionId] = useState(uuidv4())

  useEffect(()=>{
    socket.on('messages', (data) => {
      setChatContent(data)
    })
  
    socket.on('connected', () => {
      socket.emit('user:connected', new User(userSessionId, username))
    })
  }, [])
  
  // Отправляем на сервер disconnect эвент
  useBeforeunload(()=>{
    socket.emit('user:disconnected', new User(userSessionId, username))
  })

  function handleSendMessage(e) {
    e.preventDefault()

    // Игнорируем пустые сообщения
    if (message.length > 0) {
      let messageData = new Message(username, userSessionId, message, new Date().getTime())
      // Отправляем данные с сообщением на сервер
      socket.emit('user:message', messageData)
      // Удаляем значение что бы очистить поле сообщения
      setMessage('')
    }
  }

  // Проверяем, если юзер законнектился - меняем окно ввода username на окно чата
  if (connected) {
    return (
      <div>
        <ul id="messages">
          {
            // Выводим список всего контента
            chatContent.map(content => {
              if (content.type == 'message') { // Сообщения
                let message = content.data
                return <li key={message.uuid} className={message.userSessionId !== userSessionId ? 'companion' : ''}>
                  <div>
                    <span id='username'>{message.username}</span><br />
                    <span>{message.message}</span>
                  </div>
                </li>
              } else if (content.type == 'notification' && content.data.user.uuid !== userSessionId) { // Уведомления
                if (content.data.type == 'connect') {
                  return <li key={uuidv4()}>
                    <div className='notification'>
                      <span>Connected {content.data.user.username}</span><br />
                    </div>
                  </li>
                } else if (content.data.type == 'disconnect') {
                  return <li key={uuidv4()}>
                    <div className='notification'>
                      <span>Disconnected {content.data.user.username}</span><br />
                    </div>
                  </li>
                }
              }
            })
          }
        </ul>
      
        <form id="form" action="">
          <input id="input" value={message} onChange={event => setMessage(event.target.value)} autoComplete="off"/><button onClick={handleSendMessage}>Send</button>
        </form>
      </div>
    )
  } else {
    // Выводим окно ввода username
    return (
      <div id="login">
        <input id="input" placeholder='Enter username' onChange={event => { username = event.target.value; }} />
        <button onClick={() => { setConnected(true); socket.connect(); }}>Connect</button>
      </div>
    )
  }
}

export default App;
