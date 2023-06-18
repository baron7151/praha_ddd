import { IUserRepository } from 'src/domain/user/user-repository'
import prisma from '../client/prisma-clilent'
import { Injectable } from '@nestjs/common'
import { UserDataDTO } from 'src/domain/user/user-dto'

@Injectable()
export class UserDataRepository implements IUserRepository {
  public async save(saveUserData: UserDataDTO): Promise<void> {
    try {
      await prisma.user.create({ data: saveUserData })
      // await prisma.user.create({
      //   data: {
      //     userId: userId.value,
      //     userName: userName.value,
      //     email: email.value,
      //     status: status,
      //     pairId: pairId == undefined ? null : pairId.value,
      //     teamId: teamId == undefined ? null : teamId.value,
      //     taskProgressId:
      //       taskProgressId == undefined ? null : taskProgressId.value,
      //   },
      // })
    } catch (error) {
      throw error
    }
  }
  public async findByEmail(email: string): Promise<UserDataDTO | undefined> {
    try {
      const userData = await prisma.user.findUnique({
        where: { email: email },
      })
      if (userData !== null) {
        return new UserDataDTO({
          ...userData,
          pairId: userData.pairId ?? undefined,
          teamId: userData.teamId ?? undefined,
          taskProgressId: userData.taskProgressId ?? undefined,
        })
      } else {
        throw new Error('Not Found.')
      }
    } catch (error) {
      throw error
    }
  }

  public async findByUserId(userId: string): Promise<UserDataDTO | undefined> {
    try {
      const userData = await prisma.user.findUnique({
        where: { userId: userId },
      })
      if (userData !== null) {
        return new UserDataDTO({
          ...userData,
          pairId: userData.pairId ?? undefined,
          teamId: userData.teamId ?? undefined,
          taskProgressId: userData.taskProgressId ?? undefined,
        })
      } else {
        throw new Error('Not Found.')
      }
    } catch (error) {
      throw error
    }
  }

  public async exists(email: string): Promise<boolean> {
    try {
      const userData = await prisma.user.findUnique({
        where: { email: email },
      })
      if (userData) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw error
    }
  }

  public async update(
    updateUserData: UserDataDTO,
    userId: string,
  ): Promise<void> {
    try {
      await prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          userName: updateUserData.userName,
          email: updateUserData.email,
          status: updateUserData.status,
        },
      })
    } catch (error) {
      throw error
    }
  }
}
