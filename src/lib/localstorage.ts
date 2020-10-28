import { Either, tryCatch } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { curry, partial } from 'ramda'

/*
 * pure version of localStorage.getItem that won't throw
*/
export const getItem = (key: string): Either<Error, unknown> => {
  return tryCatch(
    () => pipe(
      key,
      localStorage.getItem.bind(localStorage),
      String,
      JSON.parse.bind(JSON),
    ),
    (reason) => new Error(String(reason))
  )
}

/**
 * curried, pure version of localStorage.setItem that won't throw
 */
export const setItem = curry((key: string, value: any): Either<Error, null> => {
  return tryCatch(
    () => {
      const writeToLS = partial(localStorage.setItem.bind(localStorage), [key])
      pipe(
        value,
        JSON.stringify.bind(JSON),
        writeToLS,
      )
      return null
    },
    (reason) => new Error(String(reason))
  )
})

/*
 * pure version of localStorage.removeItem that won't throw
*/
export const removeItem = (key: string): Either<Error, void> => {
  return tryCatch(
    () => pipe(
      key,
      localStorage.removeItem.bind(localStorage)
    ),
    (reason) => new Error(String(reason))
  )
}
