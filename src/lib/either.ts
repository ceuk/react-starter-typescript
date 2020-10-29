export default class Either {

  static of (b: any) {
    return new Right(b)
  }

  static isLeft (either: Left | Right) {
    return either.isLeft
  }

  static tryCatch (fa: () => any, fb: (e: Error) => any) {
    try {
      return Either.of(fa())
    } catch (err) {
      return new Left(fb(err))
    }
  }

  static fold (fa: (l: any) => any, fb: (r: any) => any, e: Left | Right) {
    return e instanceof Left
      ? fa(e.$value)
      : fb(e.$value)
  }

  $value: Left | Right

  constructor (x: any) {
    this.$value = x
  }

}

export class Left extends Either {

  $value: any

  constructor (x: any) {
    super(x)
    this.$value = x
  }

  get isLeft () {
    return true
  }

  get isRight () {
    return false
  }

  get value () {
    return this.$value
  }

  // tslint:disable-next-line:no-console
  inspect (f = console.log) {
    f('Left', this.$value)
    return this
  }

  map (_: any) {
    return this
  }

  ap (_: any) {
    return this
  }

  chain (_: any) {
    return this
  }
}

export class Right extends Either {

  $value: any

  constructor (x: any) {
    super(x)
    this.$value = x
  }

  get isLeft () {
    return false
  }

  get isRight () {
    return true
  }

  get value () {
    return this.$value
  }

  // tslint:disable-next-line:no-console
  inspect (f = console.log) {
    f('Right', this.$value)
    return this
  }

  map (f: (r: any) => Either) {
    return Either.of(f(this.$value))
  }

  ap (f: Right) {
    return f.map(this.$value)
  }

  chain (f: (r: any) => any) {
    return f(this.$value)
  }
}
