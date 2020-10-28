import { connect } from 'react-redux'
import { IGlobalState } from '../../types/state'

const mapStateToProps = (state: IGlobalState) => {
  return {
    loggedIn: !!state.auth.currentUser
  }
}

export default connect(mapStateToProps)
