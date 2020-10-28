import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { LOGIN_ATTEMPT } from '../../ducks/auth'
import { ILoginPayload } from '../../types/auth'
import { IGlobalState } from '../../types/state'

interface ILoginFormStateProps {
  loggedIn: boolean
  loggingIn: boolean
}

interface ILoginFormDispatchProps {
  handleLogin: (p: ILoginPayload) => {}
}

const LoginForm: React.FC<ILoginFormStateProps & ILoginFormDispatchProps> = ({ handleLogin, loggedIn, loggingIn }) => {
  const login = () => handleLogin({ email: 'ceuk.dev@gmail.com', password: 'abcd1234' })
  return (
    <div>
      <button onClick={login}>Click Me</button>
    </div>
  )
}

const mapStateToProps = (state: IGlobalState): ILoginFormStateProps => {
  return {
    loggedIn: !!state.auth.currentUser,
    loggingIn: state.auth.loggingIn
  }
}

const mapDispatchToProps = (dispatch: Dispatch): ILoginFormDispatchProps => {
  return {
    handleLogin: ({ email, password }: ILoginPayload) => dispatch(LOGIN_ATTEMPT({ email, password }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
