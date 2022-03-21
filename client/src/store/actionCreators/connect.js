import { USER_CONNECTED_ACTION } from '../actions/login'

function connectedAction(value) {
    return {
        type: USER_CONNECTED_ACTION,
        connected: value
    }
}

export default connectedAction