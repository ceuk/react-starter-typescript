import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Either } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as TaskEither from 'fp-ts/lib/TaskEither'
import { curry, identity, prop } from 'ramda'
import { getItem } from '../lib/localstorage'
import { IStoredToken, MakeCommonRequest } from '../types/auth'
import { AnyFnSingleParam } from '../types/common'

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
    TaskEither.fromEither<Error, IStoredToken>(getItem('currentUser')),
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
const getUnauthenticatedClient = () => {
  const baseURL = baseURLs[process.env.NODE_ENV] || baseURLs.development
  return TaskEither.of<Error, AxiosInstance>(axios.create({ baseURL }))
}

/**
 * Executes the supplied axios params on the supplied axios client and
 * wraps in a TaskEither
 *
 * @Remarks curried
 * @param params axios request params
 * @param client axios client instance
 * @returns TaskEither containing the request to be executed
 */
const executeRequest = curry((params: AxiosRequestConfig, client: AxiosInstance) => {
  return pipe(
    TaskEither.tryCatch<AxiosError, AxiosResponse<any>>(
      () => client(params),
      identity as AnyFnSingleParam
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
export const makeAuthenticatedRequest: MakeCommonRequest = (params) => {
  return pipe(
    getToken(),
    getAuthenticatedClient,
    TaskEither.chain(executeRequest(params))
  )()
}

/**
 * Makes a http request using the supplied axios params
 *
 * @param params axios request params
 * @returns A promisified http call that resolves to an either
 */
export const makeUnauthenticatedRequest: MakeCommonRequest = (params) => {
  return pipe(
    getUnauthenticatedClient(),
    TaskEither.chain(executeRequest(params))
  )()
}
