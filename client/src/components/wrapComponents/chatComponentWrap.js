import { connect } from 'react-redux';
import ChatComponent from '../chatComponent';
import mapStateToProps from '../../store/mapStateToProps';
import mapDispatchToProps from '../../store/mapDispatchToProps';

const ChatComponentWrap = connect(mapStateToProps('ChatComponent'), mapDispatchToProps('ChatComponent'))(ChatComponent)

export default ChatComponentWrap