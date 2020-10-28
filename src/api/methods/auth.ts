import { Either } from 'fp-ts/lib/Either'
import { makeAuthenticatedRequest, makeUnauthenticatedRequest } from '..'
import { ILoginPayload, IStoredToken } from '../../types/auth'

/**
 * Attempts to log in using the supplied credentials
 *
 * @param credentials email and password
 * @returns
 * @returns A promisified http call that resolves to an either
 */
export const loginRequest = ({ email, password }: ILoginPayload): Promise<Either<Error, IStoredToken>> => {
  return makeUnauthenticatedRequest({
    url: '/auth/login',
    method: 'POST',
    data: {
      email,
      password
    }
  })
}

/**
 * Attempts to validated locally-cached token
 *
 * @returns A promisified http call that resolves to an either
 */
export const validateTokenRequest = () => {
  return makeAuthenticatedRequest({
    url: '/auth/validateToken',
    method: 'GET'
  })
}
