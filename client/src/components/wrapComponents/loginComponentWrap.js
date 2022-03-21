import { connect } from 'react-redux';
import LoginComponent from '../loginComponent';
import mapStateToProps from '../../store/mapStateToProps';
import mapDispatchToProps from '../../store/mapDispatchToProps';

const LoginComponentWrap = connect(mapStateToProps('LoginComponent'), mapDispatchToProps('LoginComponent'))(LoginComponent)

export default LoginComponentWrap