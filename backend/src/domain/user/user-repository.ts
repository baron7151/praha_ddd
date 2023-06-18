import { Email } from '../common/email'
import { UserDataDTO } from './user-dto'
import { UserEntity, UserId } from './user-entity'

export interface IUserRepository {
  findByEmail(email: string): Promise<UserDataDTO | undefined>
  findByUserId(userId: string): Promise<UserDataDTO | undefined>
  save(saveUesrData: UserDataDTO): Promise<void>
  exists(email: string): Promise<boolean>
  update(updateUserData: UserDataDTO, userId: string): Promise<void>
}

export interface IUserFactory {
  create(): UserEntity
}
