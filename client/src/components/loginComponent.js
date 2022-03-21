import React from 'react'
import store from '../store/store'
import { USER_CONNECTED_ACTION, USER_CHANGED_ACTION } from '../store/actions/login'

const { v4: uuidv4 } = require('uuid');

class LoginComponent extends React.Component {
  updateUsername(username) {
    var user = store.getState().user
    user.username = username
    store.dispatch({ type: USER_CHANGED_ACTION, user: user })
  }

  updateUserUuid() {
    var user = store.getState().user
    user.uuid = uuidv4()
    store.dispatch({ type: USER_CHANGED_ACTION, user: user })
  }
  
  handleLogin = () => {
    if (store.getState().user.username.length > 0) {
      this.updateUserUuid()
      store.dispatch({ type: USER_CONNECTED_ACTION, connected: true })
    }
  }

  render() {
    return (
      <div id="login">
        <input id="input" placeholder='Enter username' onChange={ event => { this.updateUsername(event.target.value) }} />
        <button onClick={ this.handleLogin }>Connect</button>
      </div>
    )
  }
}

export default LoginComponent