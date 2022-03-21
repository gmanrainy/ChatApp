import { USER_CHANGED_ACTION } from '../actions/login'

function usernameChangedAction(value) {
    return {
        type: USER_CHANGED_ACTION,
        user: value
    }
}

export default usernameChangedAction