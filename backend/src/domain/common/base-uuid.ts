import { uuid } from 'uuidv4'

export const UUID_PATTERN =
  /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/

export abstract class BaseUuid {
  constructor(readonly value: string = uuid()) {
    this.validate(value)
  }

  private validate(value: string) {
    if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
      throw new Error(`This ID is invalid ${this.value}`)
    }
  }

  getId(): string {
    return this.value
  }

  equals(other: BaseUuid): boolean {
    return this.value === other.value
  }
}
