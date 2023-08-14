import { Email } from '../common/email'
import { UserEntity, UserId } from './user-entity'

export interface IUserRepository {
  findByEmail(email: Email): Promise<UserEntity | undefined>
  findByUserId(userId: UserId): Promise<UserEntity | undefined>
  save(saveUesrData: UserEntity): Promise<void>
  exists(email: Email): Promise<boolean>
}

export interface IUserFactory {
  create(): UserEntity
}
