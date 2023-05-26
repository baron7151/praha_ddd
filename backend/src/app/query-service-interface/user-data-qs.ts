import { Name } from 'src/domain/name'

export class UserDataDTO {
  public readonly userId: string
  public readonly name: string
  public readonly email: string
  public readonly status: string
  public constructor(props: {
    userId: string
    name: string
    email: string
    status: string
  }) {
    const { userId, name, email, status } = props
    this.userId = userId
    this.name = name
    this.email = email
    this.status = status
  }
}

export interface IUserDataQS {
  getUsers(name: string): Promise<UserDataDTO[]>
}
