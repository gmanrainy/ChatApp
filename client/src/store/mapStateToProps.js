function mapStateToProps(component) {
	switch (component) {
		case "LoginComponent": {
			return function (state) {
				return {
					username: state.username,
					connected: state.connected
				};
			}
		}
		case "ChatComponent": {
			return function (state) {
				return {
					messages: state.messages
				}
			}
		}
		default: return undefined;
	}
}

export default mapStateToProps;