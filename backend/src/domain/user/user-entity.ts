import { Email } from '../common/email'
import { BaseUuid } from '../common/base-uuid'
import {
  TaskProgressEntity,
  TaskProgressId,
} from '../task/task-progress-entity'
import { PairId } from '../pair/pair-entity'
import { TeamId } from '../team/team-entity'

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETE = 'DELETE',
}

export class UserId extends BaseUuid {
  private type = 'UserId'
}

export class UserName {
  constructor(public readonly value: string) {
    this.validate(value)
  }
  private validate(value: string) {
    if (typeof value !== 'string') {
      throw new Error(`This name is invalid. ${this.value}`)
    }
  }
  changeName(name: string): UserName {
    return new UserName(name)
  }
  equals(name: UserName) {
    return this.value === name.value ? true : false
  }
}

export class UserEntity {
  private userId: UserId
  private userName: UserName
  private email: Email
  private status: UserStatus
  private pairId?: PairId
  private teamId?: TeamId
  private taskProgressId?: TaskProgressId
  constructor(
    userId: UserId,
    userName: UserName,
    email: Email,
    status: UserStatus,
    pairId?: PairId,
    teamId?: TeamId,
    taskProgressId?: TaskProgressId,
  ) {
    this.userId = userId
    this.userName = userName
    this.email = email
    this.status = status
    this.pairId = pairId
    this.teamId = teamId
    this.taskProgressId = taskProgressId
  }
  equals(other: UserEntity): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof UserEntity)) {
      return false
    }
    return this.userId.getId() === other.userId.getId()
  }
  getAllProperties() {
    return {
      userId: this.userId.value,
      userName: this.userName.value,
      email: this.email.value,
      status: this.status,
      pairId: this.pairId?.value,
      teamId: this.teamId?.value,
      taskProgressId: this.taskProgressId?.value,
    }
  }
  canJoin(): boolean {
    if (this.status == UserStatus.ACTIVE) {
      return true
    } else {
      return false
    }
  }
  changeStatus(status: UserStatus): UserEntity {
    return new UserEntity(
      this.userId,
      this.userName,
      this.email,
      status,
      this.pairId,
      this.teamId,
      this.taskProgressId,
    )
  }
  changeUserName(userName: UserName): UserEntity {
    return new UserEntity(
      this.userId,
      userName,
      this.email,
      this.status,
      this.pairId,
      this.teamId,
      this.taskProgressId,
    )
  }
}
