import { Id } from 'src/domain/id'
import { UserEntity } from './user-entity'
import { Email } from '../email'
import { IUserRepository } from './user-repository'

export class UserService {
  private userRepository: IUserRepository
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }
  public exists(email: Email): boolean {
    const result: boolean = this.userRepository.exists(email)
    return result
  }
}
