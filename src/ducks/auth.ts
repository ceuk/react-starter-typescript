import { ActionCreatorWithNonInferrablePayload, CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as Either from 'fp-ts/Either'
import { call, put, takeLatest } from 'redux-saga/effects'
import { loginRequest, validateTokenRequest } from '../api/methods/auth'
import { removeItem, setItem } from '../lib/localstorage'
import { ILoginPayload, IStoredToken } from '../types/auth'
import { IAuthState } from '../types/state'

const initialAuthState: IAuthState = {
  currentUser: undefined,
  loggingIn: false,
  sessions: []
}

const loginAttempt: CaseReducer<IAuthState, PayloadAction<ILoginPayload>> = (state) => {
  state.loggingIn = true
}

const loginSuccess: CaseReducer<IAuthState, PayloadAction<IStoredToken>> = (state, { payload }) => {
  state.currentUser = payload.id
  state.loggingIn = false
  state.sessions = state.sessions.includes(payload.id) ? state.sessions : state.sessions.concat(payload.id)
}

const loginRestored: CaseReducer<IAuthState, PayloadAction<IStoredToken>> = (state, { payload }) => {
  state.currentUser = payload.id
  state.loggingIn = false
  state.sessions = state.sessions.includes(payload.id) ? state.sessions : state.sessions.concat(payload.id)
}

const loginFailed: CaseReducer<IAuthState, PayloadAction<string>> = (state) => {
  state.currentUser = undefined
  state.loggingIn = false
}

const logoutSuccess: CaseReducer<IAuthState> = (state) => {
  state.currentUser = undefined
  state.loggingIn = false
}

const { actions, reducer } = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    LOGIN_ATTEMPT: loginAttempt,
    LOGIN_SUCCESS: loginSuccess,
    LOGIN_RESTORED: loginRestored,
    LOGIN_FAILED: loginFailed,
    LOGOUT_SUCCESS: logoutSuccess
  }
})

function * onLoginAttempt ({ payload }: ReturnType<typeof actions.LOGIN_ATTEMPT>) {
  const res = yield call(loginRequest, payload)
  yield put(Either.fold(
    (err: Error) => actions.LOGIN_FAILED(String(err)),
    actions.LOGIN_SUCCESS as ActionCreatorWithNonInferrablePayload
  )(res))
}

function * onLoginSuccess ({ payload }: ReturnType<typeof actions.LOGIN_SUCCESS>) {
  yield call(setItem, 'currentUser', payload)
}

function * onLoginFailed () {
  // show a message saying login failed
}

function * onLoginRestored () {
  const res = yield call(validateTokenRequest)
  if (Either.isLeft(res)) {
    yield put(actions.LOGOUT_SUCCESS())
  }
}

function * onLogout () {
  yield call(removeItem, 'currentUser')
}

export function * saga () {
  yield takeLatest(actions.LOGIN_ATTEMPT, onLoginAttempt)
  yield takeLatest(actions.LOGIN_SUCCESS, onLoginSuccess)
  yield takeLatest(actions.LOGIN_RESTORED, onLoginRestored)
  yield takeLatest(actions.LOGOUT_SUCCESS, onLogout)
  yield takeLatest(actions.LOGIN_FAILED, onLoginFailed)
}

export const {
  LOGIN_ATTEMPT,
  LOGIN_RESTORED,
  LOGOUT_SUCCESS,
} = actions

export default reducer
