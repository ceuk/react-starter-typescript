import { Left, Right } from './either'
import List from './list'
import Maybe from './maybe'
import Task from './task'
import TaskEither from './taskeither'

type TMonad = Maybe | Task | TaskEither | Left | Right | List

// tslint:disable-next-line:ban-types
export const pipe = (...fns: Function[]) =>
    (...args: any[]) => fns.reduce((res, f) => [f.call(null, ...res)], args)[0]

// tslint:disable-next-line:ban-types
export const partial = (f: Function, firstArg: any) => (...lastArgs: any[]) => f(firstArg, ...lastArgs)

export const curry = (f: (...args: any[]) => any) => {
  const arity = f.length
  return function $curry (...args: any[]): (...args: any[]) => any {
    return args.length < arity
      ? $curry.bind(null, ...args)
      : f.call(null, ...args)
  }
}

export const identity = (x: any) => x

export const map = curry((f: () => any, m: TMonad) => {
  return m.map(f)
})

export const ap = curry((f: () => any, m: TMonad) => {
  return m.ap(f)
})

export const chain = curry((f: () => any, m: TMonad) => {
  return m.chain(f)
})

interface IGenericObject { [key: string]: any }
export const prop = curry((x: string, y: IGenericObject) => y[x])

export const left = (a: any) => new Left(a)

export const nothing = Maybe.of(null)

export const reject = (a: any) => Task.rejected(a)

export const either = curry((f,g,e) => e.isLeft ? f(e.$value) : g(e.$value))
