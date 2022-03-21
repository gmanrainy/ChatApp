import { bindActionCreators } from 'redux';
import usernameChangedAction from './actionCreators/login';
import connectedAction from './actionCreators/connect'
import { newMessagesAction } from './actionCreators/chat'

function mapDispatchToProps(component) {
	switch (component) {
		case "LoginComponent": return function (dispatch) {
			return {
				change_username: bindActionCreators(usernameChangedAction, dispatch),
				change_connected: bindActionCreators(connectedAction, dispatch)
			};
		};
		case "ChatComponent": return function (dispatch) {
			return {
				change_messages: bindActionCreators(newMessagesAction, dispatch)
			}
		}
		default: return undefined;
	}
}

export default mapDispatchToProps;