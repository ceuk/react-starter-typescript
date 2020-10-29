import { curry } from 'ramda'

export default class Maybe {

  // tslint:disable-next-line:no-console
  static inspect = curry((f = console.log, maybe: Maybe) => {
    f(maybe.isNothing ? 'Nothing' : maybe.$value)
    return maybe
  })

  static of (x: any) {
    return new Maybe(x)
  }

  $value: any

  constructor (x: any) {
    this.$value = x
  }

  get isNothing () {
    return this.$value === null || this.$value === undefined
  }

  chain (f: ($value: any) => any) {
    return this.isNothing ? this : f(this.$value)
  }

  map (f: ($value: any) => Maybe) {
    return this.isNothing ? this : Maybe.of(f(this.$value))
  }

  ap (f: Maybe) {
    return this.isNothing ? this : f.map(this.$value)
  }

  getOrError (e: Error | string) {
    return this.isNothing ? e : this.$value
  }

  fold (fa: () => any, fb: (x: any) => any) {
    return this.isNothing
      ? fa()
      : fb(this.$value)
  }
}
