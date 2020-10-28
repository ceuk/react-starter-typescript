import { Either } from 'fp-ts/lib/Either'
import { makeAuthenticatedRequest } from '..'
import { ILoginPayload, IStoredToken  } from '../../types/auth'

export const loginRequest = ({ email, password }: ILoginPayload): Promise<Either<Error, IStoredToken>> => {
  return makeAuthenticatedRequest({
    url: '/auth/login',
    method: 'POST',
    data: {
      email,
      password
    }
  })
}

export const validateTokenRequest = () => {
  return makeAuthenticatedRequest({
    url: '/auth/validateToken',
    method: 'GET'
  })
}
