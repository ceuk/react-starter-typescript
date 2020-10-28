import { Either, tryCatch } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { curry, partial } from 'ramda'

/**
 * Pure version of localStorage.getItem that won't throw
 *
 * @param key localStorage property to retrieve
 * @returns Either error deserialized value
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
 * Curried, pure version of localStorage.setItem that won't throw
 *
 * @Remarks curried
 * @param key localStorage property to set
 * @param value value to serialize and write to localStorage
 * @returns Either error or null
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

/**
 * Pure version of localStorage.removeItem that won't throw
 *
 * @param key localStorage property to remove
 * @returns Either error or void
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
