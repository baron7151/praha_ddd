import { Name } from '../name'
import { Email } from '../email'
import { Id } from '../id'
export class AdminEntity {
  private adminName: Name
  private email: Email
  private adminId: Id
  constructor(adminId: Id, adminName: Name, email: Email) {
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
