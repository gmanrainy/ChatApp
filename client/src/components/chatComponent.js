import React, { useEffect, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { useBeforeunload } from 'react-beforeunload';
import store from '../store/store'
import { NEW_MESSAGES } from '../store/actions/chat';

const { v4: uuidv4 } = require('uuid');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001', {
    withCredentials: false,
    autoConnect: false
});


class Message {
    constructor(user, message, date = null) {
        this.username = user.username
        this.userSessionId = user.uuid
        this.message = message
        this.date = date
    }
}


function ChatComponent() {
    // Храним стейт поля ввода
    const [message, setMessage] = useState('')
    // Селектор сообщений
    const messages = useSelector(state => state.messages, shallowEqual)

    useEffect(() => {
        socket.on('messages', (data) => {
            store.dispatch({ type: NEW_MESSAGES, messages: data })
        })

        socket.on('connected', () => {
            socket.emit('user:connected', store.getState().user)
        })

        socket.connect()
    })

    useBeforeunload(() => {
        socket.emit('user:disconnected', store.getState().user)
    })


    function handleSendMessage(e) {
        e.preventDefault()

        // Игнорируем пустые сообщения
        if (message.length > 0) {
            let messageData = new Message(store.getState().user, message)
            // Отправляем данные с сообщением на сервер
            socket.emit('user:message', messageData)
            // Удаляем значение что бы очистить поле сообщения
            setMessage('')
        }
    }



    return (
        <div>
            <ul id="messages">
                {
                    // Выводим список всего контента
                    messages.map(content => {
                        if (content.type == 'message') { // Сообщения
                            let message = content.data
                            return <li key={message.uuid} className={message.userSessionId !== store.getState().user.uuid ? 'companion' : ''}>
                                <div>
                                    <span id='username'>{message.username}</span><br />
                                    <span>{message.message}</span>
                                </div>
                            </li>
                        } else if (content.type == 'notification' && content.data.user.uuid !== store.getState().user.uuid) { // Уведомления
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
                <input id="input" value={message} onChange={event => setMessage(event.target.value) } autoComplete="off" /><button onClick={handleSendMessage}>Send</button>
            </form>
        </div>
    )
}

export default ChatComponent