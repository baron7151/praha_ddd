import { BaseUuid } from '../common/base-uuid'
import { Email } from '../common/email'

export class AdminId extends BaseUuid {
  private type = 'AdminId'
}

export class AdminName {
  constructor(public readonly value: string) {
    this.validate(value)
  }
  private validate(value: string) {
    if (typeof value !== 'string') {
      throw new Error(`This name is invalid. ${this.value}`)
    }
  }
  changeName(name: string): AdminName {
    return new AdminName(name)
  }
}

export class AdminEntity {
  private adminName: AdminName
  private email: Email
  private adminId: AdminId
  constructor(adminId: AdminId, adminName: AdminName, email: Email) {
    this.adminId = adminId
    this.adminName = adminName
    this.email = email
  }
  equals(other: AdminEntity): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof AdminEntity)) {
      return false
    }
    return this.adminId.getId() === other.adminId.getId()
  }
}
