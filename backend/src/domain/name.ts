export class Name {
  private name: string

  constructor(name: string) {
    this.name = name
  }
  changeName(name: string): Name {
    return new Name(name)
  }
}
