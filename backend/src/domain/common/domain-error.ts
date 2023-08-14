export class DomainError extends Error {
  constructor(public readonly message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = 'DomainError'
  }
}
