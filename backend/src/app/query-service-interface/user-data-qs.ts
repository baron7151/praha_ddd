import { UserDataDTO } from 'src/domain/user/user-dto'

export interface IUserDataQS {
  getUsers(name: string): Promise<UserDataDTO[]>
  getAllUsers(): Promise<UserDataDTO[]>
}
