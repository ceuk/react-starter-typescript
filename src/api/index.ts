import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Either, { Left, Right } from '../lib/either'
import { chain, curry, identity, map, pipe, prop } from '../lib/helpers'
import { getItem } from '../lib/localstorage'
import TaskEither from '../lib/taskeither'
import { MakeCommonRequest } from '../types/auth'

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
  return pipe<Left<Error> | Right<string>>(
    getItem,
    map(prop('token'))
  )('currentUser')
}

/**
 * Creats an axios client with the appriopriate base URL and Auth header
 *
 * @param maybeToken Either-wrapped token string
 * @returns axios client wrapped in Either
 */
const getAuthenticatedClient = (maybeToken: Either<Error, string>) => {
  // TODO - make this pure
  const baseURL = baseURLs[process.env.NODE_ENV] || baseURLs.development
  return pipe<Left<Error> | Right<AxiosInstance>>(
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
const createRequest = curry<TaskEither<Error, any>>((params: AxiosRequestConfig, client: AxiosInstance) => {
  const requestTask = TaskEither.tryCatch(
    () => client(params),
    identity
  )
  return pipe<any>(
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
  const request = pipe<TaskEither<Error, any>>(
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
  const request = pipe<TaskEither<Error, any>>(
    getUnauthenticatedClient,
    chain(createRequest(params)),
  )()
  return TaskEither.runIfValid(request)
}
