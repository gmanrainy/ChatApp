import { combineReducers } from "redux";
import user from './loginReducer';
import connected from './connectReducer';
import messages from './chatReducer';

const reducers = combineReducers({
    user, connected, messages
})

export default reducers