import { uuid } from 'uuidv4'
import { UserEntity, UserId, UserName, UserStatus } from './user-entity'
import { IUserRepository } from './user-repository'
import { Inject, Injectable } from '@nestjs/common'
import { Providers } from 'src/providers'
import { Email } from '../common/email'
import { TaskProgressId } from '../task/task-progress-entity'
import { PairId } from '../pair/pair-entity'
import { TeamId } from '../team/team-entity'

@Injectable()
export class UserFactory {
  constructor(
    @Inject(Providers.IUserRepository)
    private userReposigory: IUserRepository,
  ) {}
  public async addUser(name: string, email: string): Promise<UserEntity> {
    const userId = new UserId(uuid())
    const userName = new UserName(name)
    const userEmail = new Email(email)
    const userStatus = UserStatus.ACTIVE
    try {
      const duplicateEmailCheck = await this.userReposigory.exists(email)
      if (duplicateEmailCheck) {
        throw new Error(`This Email is already registered. ${email}`)
      }
    } catch (error) {
      throw error
    }
    return new UserEntity(userId, userName, userEmail, userStatus)
  }
  static create(
    userId: string,
    userName: string,
    email: string,
    status: string,
    taskProgressId?: string,
    pairId?: string,
    teamId?: string,
  ): UserEntity {
    return new UserEntity(
      new UserId(userId),
      new UserName(userName),
      new Email(email),
      status as UserStatus,
      pairId === undefined ? undefined : new PairId(pairId),
      teamId === undefined ? undefined : new TeamId(teamId),
      taskProgressId === undefined
        ? undefined
        : new TaskProgressId(taskProgressId),
    )
  }

  static reconstruct(
    userEntity: UserEntity,
    newUserName?: string,
    newEmail?: string,
    newStatus?: string,
    newPairId?: string,
    newTeamId?: string,
    newTaskProgressId?: string,
  ): UserEntity {
    const { userId, userName, email, status, pairId, teamId, taskProgressId } =
      userEntity.getAllProperties()
    return new UserEntity(
      new UserId(userId),
      newUserName === undefined
        ? new UserName(userName)
        : new UserName(newUserName),
      newEmail === undefined ? new Email(email) : new Email(newEmail),
      newStatus === undefined ? status : (newStatus as UserStatus),
      newPairId === undefined ? new PairId(pairId) : new PairId(newPairId),
      newTeamId === undefined ? new TeamId(teamId) : new TeamId(newTeamId),
      newTaskProgressId === undefined
        ? new TaskProgressId(taskProgressId)
        : new TaskProgressId(newTaskProgressId),
    )
  }
}
