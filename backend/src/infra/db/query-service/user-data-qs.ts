import { PrismaClient } from '@prisma/client'
import {
  UserDataDTO,
  IUserDataQS,
} from 'src/app/query-service-interface/user-data-qs'

export class UserDataQS implements IUserDataQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getUsers(name: string): Promise<UserDataDTO[]> {
    const users = await this.prismaClient.user.findMany({
      where: { name: name },
    })
    return users.map(
      (user) =>
        new UserDataDTO({
          userId: user.user_id,
          name: user.name,
          email: user.email,
          status: user.status,
        }),
    )
  }
  public async getAllUsers(): Promise<UserDataDTO[]> {
    const users = await this.prismaClient.user.findMany({})
    return users.map(
      (user) =>
        new UserDataDTO({
          userId: user.user_id,
          name: user.name,
          email: user.email,
          status: user.status,
        }),
    )
  }
}
