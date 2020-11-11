import { PartialMapCallback } from '../types/common'
import Either, { Left, Right } from './either'
import { left } from './helpers'
import Task from './task'

export default class TaskEither<A = any, B = any> extends Task<A, B> {

  static tryCatch <A = any, B = any> (f: () => B, g: (b: Error) => A) {
    return new TaskEither<Left<A>, Right<B>>(async (reject, resolve) => {
      try {
        const b = await f()
        resolve(Either.of(b))
      } catch (a) {
        reject(left(g(a)))
      }
    })
  }

  static fromEither<A = any, B = any> (m: Either<A, B>) {
    return new TaskEither<Left<A>, Right<B>>((reject, resolve) => {
      if (m.isLeft) {
        reject(left(m.$value as A))
      } else {
        resolve(Either.of(m.$value as B))
      }
    })
  }

  static runIfValid <A = any, B = any> (x: TaskEither<A, B> | A | B): Promise<Either<A, B> | A | B> {
    return x instanceof TaskEither
      ? new Promise<any>((resolve) => {
        x.fork(resolve, resolve)
      })
      : Promise.resolve(x)
  }

  map <B1 = any> (f: PartialMapCallback<B, B1>) {
    const fork = this.fork
    const cleanup = this.cleanup

    return new TaskEither<A, B1>(
      (reject, resolve) => fork(
        reject,
        (b) => resolve((b as any)?.map(f))
      ),
      cleanup
    )
  }

  chain <B1 = any> (f: (b: any) => Task<A, B1>) {
    const fork = this.fork
    const cleanup = this.cleanup

    return new TaskEither<A, B1>(
      (reject, resolve) => fork(
        reject,
        (b) => f(b).fork(reject, resolve)
      ),
      cleanup
    )
  }
}
