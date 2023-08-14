import {
  IUserDataQS,
  UserDataDTO,
} from 'src/app/query-service-interface/user-data-qs'

import { Injectable } from '@nestjs/common'

import { prisma } from 'src/prisma'

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
          pairId: user.pairId ?? undefined,
          teamId: user.teamId ?? undefined,
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
          pairId: user.pairId ?? undefined,
          teamId: user.teamId ?? undefined,
        }),
    )
  }
}
