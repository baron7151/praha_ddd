import { Email } from '../common/email'
import { PairId } from '../pair/pair-entity'
import { TeamId } from '../team/team-entity'
import { UserEntity, UserId } from './user-entity'

export interface IUserRepository {
  findByEmail(email: Email): Promise<UserEntity | undefined>
  findByUserId(userId: UserId): Promise<UserEntity | undefined>
  findByTeamId(teamId: TeamId): Promise<UserEntity[] | undefined>
  findByPairId(pairId: PairId): Promise<UserEntity[] | undefined>
  findByManyUserIds(userIds: UserId[]): Promise<UserEntity[] | undefined>
  save(saveUesrData: UserEntity): Promise<void>
  exists(email: Email): Promise<boolean>
}

export interface IUserFactory {
  create(): UserEntity
}
