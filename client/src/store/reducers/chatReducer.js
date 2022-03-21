import initialState from '../initialState'
import { NEW_MESSAGES } from '../actions/chat'



export default function messages(state = initialState.messages, action) {
    switch(action.type) {
        case NEW_MESSAGES: return action.messages

        default: return state
    }
}