import { makeAuthenticatedRequest, makeUnauthenticatedRequest } from '..'
import Either from '../../lib/either'
import { ILoginPayload, IStoredToken } from '../../types/auth'

/**
 * Attempts to log in using the supplied credentials
 *
 * @param credentials email and password
 * @returns A promisified http call that resolves to an either
 */
export const loginRequest = ({ email, password }: ILoginPayload) => {
  return makeUnauthenticatedRequest({
    url: '/auth/login',
    method: 'POST',
    data: {
      email,
      password
    }
  }) as Promise<Either<Error, IStoredToken>>
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
  }) as Promise<Either<Error, void>>
}
