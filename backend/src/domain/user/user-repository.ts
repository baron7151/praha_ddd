import { Email } from '../email'
import { Id } from '../id'
import { UserEntity } from './user-entity'

export interface IUserRepository {
  find(userId: Id): UserEntity
  save(user: UserEntity): Promise<UserEntity>
  exists(email: Email): boolean
}

export interface IUserFactory {
  create(): UserEntity
}
