import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Login from './components/Login/login.container'
import PrivateRoute from './components/PrivateRoute'
import WithSession from './components/Session'
import { getItem } from './lib/localstorage'
import { IStoredToken } from './types/auth'

interface IAppProps {
  restoreSession: (c: IStoredToken) => void
}

const App: React.FC<IAppProps> = ({ restoreSession }) => {
  useEffect(() => {
    const cachedCredentials = getItem('currentUser')
    if (!cachedCredentials.isLeft && cachedCredentials.value) {
      restoreSession(cachedCredentials.value)
    }
  }, [])
  return (
    <div className='App'>
      <Router>
        <Switch>
          <PrivateRoute path='/' exact component={() => 'home'} />
          <Route path='/login' component={Login} />
        </Switch>
      </Router>
    </div>
  )
}

export default WithSession(App)
