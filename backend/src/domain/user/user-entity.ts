import { Email } from '../common/email'
import { BaseUuid } from '../common/base-uuid'
import { PairId } from '../pair/pair-entity'
import { DomainError } from '../common/domain-error'
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
  constructor(
    userId: UserId,
    userName: UserName,
    email: Email,
    status: UserStatus,
    pairId?: PairId,
    teamId?: TeamId,
  ) {
    if (UserEntity.checkUserStatusAndPairAndTeam(status, pairId, teamId)) {
      throw new DomainError(
        'ステータスが「在籍中」ではない場合、どのチームにもペアにも所属できません。',
      )
    }
    this.userId = userId
    this.userName = userName
    this.email = email
    this.status = status
    this.pairId = pairId
    this.teamId = teamId
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
      userId: this.userId,
      userName: this.userName,
      email: this.email,
      status: this.status,
      pairId: this.pairId,
      teamId: this.teamId,
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
    switch (status) {
      case UserStatus.ACTIVE:
        return new UserEntity(
          this.userId,
          this.userName,
          this.email,
          status,
          this.pairId,
          this.teamId,
        )
      case UserStatus.INACTIVE:
        return new UserEntity(this.userId, this.userName, this.email, status)
      case UserStatus.DELETE:
        return new UserEntity(this.userId, this.userName, this.email, status)
      default:
        throw new DomainError('Something is wrong.')
    }
  }
  changeUserName(userName: UserName): UserEntity {
    return new UserEntity(
      this.userId,
      userName,
      this.email,
      this.status,
      this.pairId,
      this.teamId,
    )
  }
  changeEmail(email: Email): UserEntity {
    return new UserEntity(
      this.userId,
      this.userName,
      email,
      this.status,
      this.pairId,
      this.teamId,
    )
  }
  static checkUserStatusAndPairAndTeam(
    status: UserStatus,
    pairId?: PairId,
    teamId?: TeamId,
  ): boolean {
    if (
      (status === UserStatus.INACTIVE || status === UserStatus.DELETE) &&
      (pairId !== undefined || teamId !== undefined)
    ) {
      return true
    } else {
      return false
    }
  }
  changePair(changePairId: PairId): UserEntity {
    return new UserEntity(
      this.userId,
      this.userName,
      this.email,
      this.status,
      changePairId,
      this.teamId,
    )
  }
  changeTeam(changeTeamId: TeamId): UserEntity {
    return new UserEntity(
      this.userId,
      this.userName,
      this.email,
      this.status,
      this.pairId,
      changeTeamId,
    )
  }
  static isStringInUserStatus(inputString: string): boolean {
    return Object.values(UserStatus as any).includes(inputString)
  }
}
