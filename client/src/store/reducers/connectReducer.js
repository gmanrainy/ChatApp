import initialState from '../initialState'
import { USER_CONNECTED_ACTION } from '../actions/login'



export default function connected(state = initialState.connected, action) {
    switch(action.type) {
        case USER_CONNECTED_ACTION: return action.connected

        default: return state
    }
}