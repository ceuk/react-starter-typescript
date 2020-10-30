import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Either from '../lib/either'
import { chain, curry, identity, map, pipe, prop } from '../lib/helpers'
import { getItem } from '../lib/localstorage'
import TaskEither from '../lib/taskeither'
import { MakeCommonRequest } from '../types/auth'
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
 * @returns Either-wrapped token string
 */
const getToken = () => {
  return pipe(
    getItem,
    map(prop('token'))
  )('currentUser')
}

/**
 * Creats an axios client with the appriopriate base URL and Auth header
 *
 * @param maybeToken Either-wrapped token string
 * @returns axios client wrapped in TaskEither
 */
const getAuthenticatedClient = (maybeToken: Either) => {
  // TODO - make this pure
  const baseURL = baseURLs[process.env.NODE_ENV] || baseURLs.development
  return pipe(
    map((token: string) => axios.create({
      baseURL,
      headers: {
        common: {
          Authorization: `Bearer ${token}`
        }
      }
    })))(maybeToken)
}

/**
 * Creats an axios client with the appriopriate base URL
 *
 * @returns axios client wrapped in Either
 */
const getUnauthenticatedClient = () => {
  const baseURL = baseURLs[process.env.NODE_ENV] || baseURLs.development
  return Either.of(axios.create({ baseURL }))
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
  const requestTask = TaskEither.tryCatch(
    () => client(params),
    identity as AnyFnSingleParam
  )
  return pipe(
    map(prop('data'))
  )(requestTask)
})

/**
 * Makes an authenticated http request using the supplied axios params
 *
 * @param params axios request params
 * @returns A promisified http call that resolves to an either
 */
export const makeAuthenticatedRequest: MakeCommonRequest = (params) => {
  const request = pipe(
    getToken,
    getAuthenticatedClient,
    chain(createRequest(params))
  )()
  return TaskEither.runIfValid(request)
}

/**
 * Makes a http request using the supplied axios params
 *
 * @param params axios request params
 * @returns A promisified http call that resolves to an either
 */
export const makeUnauthenticatedRequest: MakeCommonRequest = (params) => {
  const request = pipe(
    getUnauthenticatedClient,
    chain(createRequest(params)),
  )()
  return TaskEither.runIfValid(request)
}
