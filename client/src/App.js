import './App.css';
import React, { useEffect, useState, useRef } from "react";
import { useBeforeunload } from 'react-beforeunload';
import LoginComponent from './components/wrapComponents/loginComponentWrap'
import ChatComponent from './components/wrapComponents/chatComponentWrap'
import store from './store/store'

function App() {
  const [ connected, setConnected ] = useState(false)

  // Подписываемся на обновление пропов
  store.subscribe(() => {
    setConnected(store.getState().connected)
  })

  // Меняем компонент при коннекте
  if(connected) {
    return <ChatComponent />
  }
  return <LoginComponent />
}

export default App;
