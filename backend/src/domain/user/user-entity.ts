import { Name } from '../name'
import { Email } from '../email'
import { Id } from '../id'

type UserStatus = 'registered' | 'suspension' | 'withdrawal'

export class UserEntity {
  private userName: Name
  private email: Email
  private userId: String
  private pairId?: String
  private teamId?: String
  private taskProgressId?: String
  private status: UserStatus
  constructor(
    userId: String,
    userName: Name,
    email: Email,
    status: UserStatus,
    taskProgressId?: String,
    pairId?: String,
    teamId?: String,
  ) {
    this.pairId = pairId
    this.teamId = teamId
    this.userName = userName
    this.email = email
    this.userId = userId
    this.taskProgressId = taskProgressId
    this.status = status
  }
  equals(other: UserEntity): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof UserEntity)) {
      return false
    }
    return this.userId === other.userId
  }
  getAllProperties() {
    return {
      pairId: this.pairId,
      teamId: this.teamId,
      userId: this.userId,
      userName: this.userName,
      email: this.email,
      taskProgressId: this.taskProgressId,
      status: this.status,
    }
  }
  canJoin(): boolean {
    if (this.status == 'registered') {
      return true
    } else {
      return false
    }
  }
}
