import { NEW_MESSAGES } from '../actions/chat'

function newMessagesAction(value) {
    return {
        type: NEW_MESSAGES,
        messages: value
    }
}

export { newMessagesAction }