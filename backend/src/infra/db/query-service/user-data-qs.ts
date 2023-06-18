import { IUserDataQS } from 'src/app/query-service-interface/user-data-qs'
import prisma from '../client/prisma-clilent'
import { Injectable } from '@nestjs/common'
import { UserDataDTO } from 'src/domain/user/user-dto'

@Injectable()
export class UserDataQS implements IUserDataQS {
  public async getUsers(userName: string): Promise<UserDataDTO[]> {
    const users = await prisma.user.findMany({
      where: { userName: userName },
    })
    return users.map(
      (user) =>
        new UserDataDTO({
          userId: user.userId,
          userName: user.userName,
          email: user.email,
          status: user.status,
        }),
    )
  }
  public async getAllUsers(): Promise<UserDataDTO[]> {
    const users = await prisma.user.findMany({})
    return users.map(
      (user) =>
        new UserDataDTO({
          userId: user.userId,
          userName: user.userName,
          email: user.email,
          status: user.status,
        }),
    )
  }
}
