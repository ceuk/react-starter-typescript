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

/**
 * retrieves the currentUser field from localStorage, converts from Either -> TaskEither
 * and maps to the 'token' field
 *
 * @returns TaskEither-wrapped token string
 */
const getToken = () => {
  return pipe(
    TaskEither.fromEither(getItem('currentUser')) as TaskEither.TaskEither<Error, IStoredToken>,
    TaskEither.map(prop('token'))
  )
}

/**
 * Creats an axios client with the appriopriate base URL and Auth header
 *
 * @param maybeToken TaskEither-wrapped token string
 * @returns axios client wrapped in TaskEither
 */
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

/**
 * Creats an axios client with the appriopriate base URL
 *
 * @returns axios client wrapped in TaskEither
 */
const getUnauthenticatedClient = (): TaskEither.TaskEither<Error, AxiosInstance> => {
  const baseURL = baseURLs[process.env.NODE_ENV] || baseURLs.development
  return TaskEither.of(axios.create({ baseURL }))
}

/**
 * Applies the supplied axios params to the supplied axios client and
 * wraps the ready-to-call request in a TaskEither
 *
 * @Remarks curried
 * @param params axios request params
 * @param client axios client instance
 * @returns TaskEither containing the request to be executed
 */
const createRequest = curry((params: AxiosRequestConfig, client: AxiosInstance) => {
  return pipe(
    TaskEither.tryCatch(
      () => client(params),
      identity
    ),
    TaskEither.map(prop('data'))
  )
})

/**
 * Makes an authenticated http request using the supplied axios params
 *
 * @param params axios request params
 * @returns A promisified http call that resolves to an either
 */
export const makeAuthenticatedRequest = (params: AxiosRequestConfig): Promise<Either<Error, any>> => {
  return pipe(
    getToken(),
    getAuthenticatedClient,
    TaskEither.chain(createRequest(params))
  )()
}

/**
 * Makes a http request using the supplied axios params
 *
 * @param params axios request params
 * @returns A promisified http call that resolves to an either
 */
export const makeUnauthenticatedRequest = (params: AxiosRequestConfig): Promise<Either<Error, any>> => {
  return pipe(
    getUnauthenticatedClient(),
    TaskEither.chain(createRequest(params))
  )()
}
