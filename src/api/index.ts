import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Either } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as TaskEither from 'fp-ts/lib/TaskEither'
import { curry, identity, prop } from 'ramda'
import { getItem } from '../lib/localstorage'
import { IStoredToken } from '../types/auth'

// API Config
const baseURLs = {
  development: 'http://localhost:3005/api',
  test: '',
  production: ''
}

const getToken = () => {
  return pipe(
    TaskEither.fromEither(getItem('currentUser')) as TaskEither.TaskEither<Error, IStoredToken>,
    TaskEither.map(prop('token'))
  )
}

const getAuthenticatedClient = (maybeToken: TaskEither.TaskEither<Error, string>) => {
  // TODO - make this pure
  const baseURL = baseURLs[process.env.NODE_ENV] || baseURLs.development
  return pipe(
    maybeToken,
    TaskEither.map((token) => axios.create({
      baseURL,
      headers: {
        common: {
          Authorization: `Bearer ${token}`
        }
      }
    })))
}

const executeRequest = curry((params: AxiosRequestConfig, client: AxiosInstance) => {
  return pipe(
    TaskEither.tryCatch(
      () => client(params),
      identity
    ),
    TaskEither.map((res) => res.data as any)
  )
})

export const makeAuthenticatedRequest = (params: AxiosRequestConfig): Promise<Either<Error, any>> => {
  return pipe(
    getToken(),
    getAuthenticatedClient,
    TaskEither.chain(executeRequest(params))
  )()
}
