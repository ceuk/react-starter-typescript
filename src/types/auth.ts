import { AxiosRequestConfig } from 'axios'
import { Left, Right } from '../lib/either'

export interface IStoredToken {
  id: string
  token: string
}

export interface ILoginPayload {
  email: string,
  password: string
}

export type MakeCommonRequest<T = any> = (params: AxiosRequestConfig) => Promise<Left | Right> | Error | Left
