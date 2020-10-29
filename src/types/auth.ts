import { AxiosRequestConfig } from 'axios'
import { Either } from 'fp-ts/lib/Either'

export interface IStoredToken {
  id: string
  token: string
}

export interface ILoginPayload {
  email: string,
  password: string
}

export type MakeCommonRequest<T = any> = (params: AxiosRequestConfig) => Promise<Either<Error, T>>
