import { curry } from 'ramda'

export type TTaskReject = (a?: any) => void
export type TTaskResolve = (b?: any) => void
export type TTaskCleanup = (c?: any) => void
export type TTaskCallback = (reject: TTaskReject, resolve: TTaskResolve) => any

export default class Task {

  static of (b: any) {
    const taskDefault: TTaskCallback = (_, resolve) => resolve(b)
    return new Task(taskDefault)
  }

  static rejected (a: any) {
    return new Task((reject: TTaskReject) => reject(a))
  }

  fork: TTaskCallback
  cleanup: TTaskCleanup

  constructor (computation: TTaskCallback, cleanup?: TTaskCleanup) {
    this.fork = computation
    this.cleanup = cleanup || (() => undefined)
  }

  /**
   * Returns a task that will never resolve
   */
  empty () {
    return new Task(() => undefined)
  }

  /**
   * Transforms a failure value into a new Task[a, b]. Does nothing if the
   * structure already contains a successful value.
   */
  orElse (f: (a: any) => Task) {
    const fork = this.fork
    const cleanup = this.cleanup

    return new Task(
      (reject, resolve) => fork(
        (a) => f(a).fork(reject, resolve),
        resolve
      ),
      cleanup
    )
  }

  /**
   * Takes two functions, applies the leftmost one to the failure value
   * and the rightmost one to the successful value depending on which
   * one is present
   */
  fold (fa: (a: any) => void, fb: (b: any) => void) {
    const fork = this.fork
    const cleanup = this.cleanup

    return new Task(
      (_, resolve) => fork(
        (a) => resolve(fa(a)),
        (b) => resolve(fb(b))
      ),
      cleanup
    )
  }

  /**
   * Transforms the successful value of the task
   * using a function to a monad
   */
  chain (f: (b: any) => Task) {
    const fork = this.fork
    const cleanup = this.cleanup

    return new Task(
      (reject, resolve) => fork(
        reject,
        (b: any) => f(b).fork(reject, resolve)
      ),
      cleanup
    )
  }

  /**
   * Apply the successful value of one task to another
   */
  ap (taska: Task) {
    return this.chain((f: (b: any) => any) => taska.map(f))
  }

  /**
   * Transforms the successful value of the task
   * using a regular unary function
   */
  map (f: (b: any) => void) {
    const fork = this.fork
    const cleanup = this.cleanup

    return new Task(
      (reject, resolve) => fork(
        reject,
        (b) => resolve(f(b))
      ),
      cleanup
    )
  }
}
