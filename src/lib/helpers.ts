// TODO: replace anys with generics where possible in whole file

import { Left, Right } from './either'
import List from './list'
import Maybe from './maybe'
import Task from './task'
import TaskEither from './taskeither'
import Monad from './monad'

// tslint:disable-next-line:ban-types
export const pipe = <T> (...fns: Function[]) =>
    (...args: any[]): T => fns.reduce((res, f) => [f.call(null, ...res)], args)[0]

// tslint:disable-next-line:ban-types
export const partial = (f: Function, firstArg: any) => (...lastArgs: any[]) => f(firstArg, ...lastArgs)

export type TCurriedFunction<T> = (...args: any[]) => T | TCurriedFunction<T>

export const curry = <T> (f: (...args: any[]) => T): TCurriedFunction<T> => {
  const arity = f.length
  return function $curry (...args: any[]): T | TCurriedFunction<T> {
    return args.length < arity
      ? $curry.bind(null, ...args)
      : f.call(null, ...args)
  }
}

export const identity = (x: any): typeof x => x
export const map = curry<any>((f: () => any, m: Monad) => {
  return m.map(f)
})

export const ap = curry<Monad>((f: () => any, m: Monad) => {
  return m.ap(f)
})

export const chain = curry<any>((f: () => any, m: Monad) => {
  return m.chain(f)
})

interface IGenericObject { [key: string]: any }
export const prop = curry<any>((x: string, y: IGenericObject) => y[x])

export const left = <L = any>(a: L) => new Left<L>(a)

export const nothing = Maybe.of(null)

export const reject = (a: any) => Task.rejected<typeof a>(a)

export const either = curry<any>((f,g,e) => e.isLeft ? f(e.$value) : g(e.$value))
