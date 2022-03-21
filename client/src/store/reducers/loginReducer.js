import initialState from '../initialState'
import { USER_CHANGED_ACTION } from '../actions/login'



export default function user(state = initialState.user, action) {
    switch(action.type) {
        case USER_CHANGED_ACTION: return action.user

        default: return state
    }
}