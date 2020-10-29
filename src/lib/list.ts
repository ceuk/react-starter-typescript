export default class List {

  static of (x: any) {
    return new List([x])
  }

  $value: any[]
  constructor (xs: any[]) {
    this.$value = xs
  }

  // tslint:disable-next-line:no-console
  inspect (f = console.log) {
    f('List:', this.$value)
    return this
  }

  concat (x: any) {
    return new List(this.$value.concat(x))
  }

  map (f: (v: any) => any) {
    return new List(this.$value.map(f))
  }

  ap () {
    return this.$value
  }

  chain (f: (v: any) => any) {
    return this.$value.map(f)
  }
}
