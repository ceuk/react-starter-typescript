import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import React from 'react'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import authReducer, { saga as authSaga } from './ducks/auth'

const sagas = [
  authSaga()
]

const reducers = {
  auth: authReducer
}

const sagaMiddleware = createSagaMiddleware()

// build saga middleware
function * rootSaga () {
  yield all(sagas)
}

const buildMiddleware = (includeLogger: boolean) => {
  // apply default middleware
  const middleware = [
    ...getDefaultMiddleware(),
    sagaMiddleware
  ]
  // include logger if enabled
  return includeLogger
    ? middleware.concat(logger)
    : middleware
}

export const store = configureStore({
  reducer: reducers,
  middleware: buildMiddleware(process .env.NODE_ENV !== 'production')
})

sagaMiddleware.run(rootSaga)

interface IReduxStorePropTypes {
  children: React.ReactChild
}

const ReduxStore = ({ children }: IReduxStorePropTypes) => (
  <Provider store={store}>
    {children}
  </Provider>
)

export default ReduxStore
