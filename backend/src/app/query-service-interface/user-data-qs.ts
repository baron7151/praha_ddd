import { StringColorFormat } from '@faker-js/faker'

export class UserDataDTO {
  public readonly userId: string
  public readonly userName: string
  public readonly email: string
  public readonly status: string
  public readonly pairId?: string
  public readonly teamId?: string
  public constructor(props: {
    userId: string
    userName: string
    email: string
    status: string
    pairId?: string
    teamId?: string
  }) {
    const { userId, userName, email, status, pairId, teamId } = props
    this.userId = userId
    this.userName = userName
    this.email = email
    this.status = status
    this.pairId = pairId
    this.teamId = teamId
  }
}

export interface IUserDataQS {
  getUsers(name: string): Promise<UserDataDTO[]>
  getAllUsers(): Promise<UserDataDTO[]>
}
