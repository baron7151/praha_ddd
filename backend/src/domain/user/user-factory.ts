import { uuid } from 'uuidv4'
import { UserEntity, UserId, UserName, UserStatus } from './user-entity'
import { IUserRepository } from './user-repository'
import { Inject, Injectable } from '@nestjs/common'
import { Providers } from 'src/providers'
import { Email } from '../common/email'
import { PairId } from '../pair/pair-entity'
import { TeamId } from '../team/team-entity'
import { DomainError } from '../common/domain-error'

@Injectable()
export class UserFactory {
  constructor(
    @Inject(Providers.IUserRepository)
    private userRepository: IUserRepository,
  ) {}
  public async addUser(userName: string, email: string): Promise<UserEntity> {
    const userId = new UserId(uuid())
    const userStatus = UserStatus.ACTIVE

    const duplicateEmailCheck = await this.userRepository.exists(
      new Email(email),
    )
    if (duplicateEmailCheck) {
      throw new DomainError(`This Email is already registered. ${email}`)
    }
    return new UserEntity(
      userId,
      new UserName(userName),
      new Email(email),
      userStatus,
    )
  }
  static create(props: {
    userId: string
    userName: string
    email: string
    status: string
    pairId?: string | null
    teamId?: string | null
  }): UserEntity {
    const { userId, userName, email, status, pairId, teamId } = props
    return new UserEntity(
      new UserId(userId),
      new UserName(userName),
      new Email(email),
      status as UserStatus,
      pairId == undefined ? undefined : new PairId(pairId),
      teamId == undefined ? undefined : new TeamId(teamId),
    )
  }

  public async reconstruct(props: {
    userEntity: UserEntity
    newUserName?: string
    newEmail?: string
    newStatus?: string
    newPairId?: string
    newTeamId?: string
  }): Promise<UserEntity> {
    const {
      userEntity,
      newUserName,
      newEmail,
      newStatus,
      newPairId,
      newTeamId,
    } = props
    const { userId, userName, email, status, pairId, teamId } =
      userEntity.getAllProperties()
    if (newEmail) {
      const duplicateEmailCheck = await this.userRepository.exists(
        new Email(newEmail),
      )
      if (duplicateEmailCheck) {
        throw new DomainError(`This Email is already registered. ${email}`)
      }
    }
    return new UserEntity(
      new UserId(userId.value),
      newUserName === undefined
        ? new UserName(userName.value)
        : new UserName(newUserName),
      newEmail === undefined ? new Email(email.value) : new Email(newEmail),
      newStatus === undefined ? status : (newStatus as UserStatus),
      newPairId === undefined
        ? pairId === undefined
          ? undefined
          : pairId
        : new PairId(newPairId),
      newTeamId === undefined
        ? teamId === undefined
          ? undefined
          : teamId
        : new TeamId(newTeamId),
    )
  }
}
