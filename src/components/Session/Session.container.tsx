import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { LOGIN_RESTORED } from '../../ducks/auth'
import { IStoredToken } from '../../types/auth'

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    restoreSession: (cachedCredentials: IStoredToken) => dispatch(LOGIN_RESTORED(cachedCredentials))
  }
}

export default connect(null, mapDispatchToProps)
