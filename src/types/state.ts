export interface IAuthState {
  currentUser: string | undefined,
  loggingIn: boolean,
  sessions: string[]
}

export interface IGlobalState {
  auth: IAuthState
}
