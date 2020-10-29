import { makeAuthenticatedRequest, makeUnauthenticatedRequest } from '..'
import { ILoginPayload } from '../../types/auth'

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
