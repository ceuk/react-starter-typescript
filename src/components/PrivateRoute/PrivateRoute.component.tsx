import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

interface IPrivateRouteProps {
  loggedIn: boolean
  [key: string]: any
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ loggedIn, ...otherProps }) => {
  const location = useLocation()
  return loggedIn
    ? <Route {...otherProps} />
    : <Redirect to={{
      pathname: '/login',
      state: { from: location }
    }} />
}

export default PrivateRoute
