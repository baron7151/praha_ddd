import { IUserRepository } from 'src/domain/user/user-repository'

import { Injectable } from '@nestjs/common'
import { UserEntity, UserId } from 'src/domain/user/user-entity'
import { UserFactory } from 'src/domain/user/user-factory'
import { Email } from 'src/domain/common/email'
import { prisma } from 'src/prisma'

@Injectable()
export class UserDataRepository implements IUserRepository {
  public async save(saveUserEntity: UserEntity): Promise<void> {
    const { userId, userName, email, status, pairId, teamId } =
      saveUserEntity.getAllProperties()
    await prisma.$transaction(async (tx) => {
      const result = await tx.user.findUnique({
        where: { userId: userId.value },
      })
      if (result !== null) {
        await tx.user.update({
          where: { userId: userId.value },
          data: {
            userId: userId.value,
            userName: userName.value,
            email: email.value,
            status: status,
            pairId: pairId?.value,
            teamId: teamId?.value,
          },
        })
      } else {
        await tx.user.create({
          data: {
            userId: userId.value,
            userName: userName.value,
            email: email.value,
            status: status,
            pairId: pairId?.value,
            teamId: teamId?.value,
          },
        })
      }
    })
  }
  public async findByEmail(email: Email): Promise<UserEntity | undefined> {
    const userData = await prisma.user.findUnique({
      where: { email: email.value },
    })
    if (userData !== null) {
      return UserFactory.create({
        ...userData,
        pairId: userData?.pairId !== null ? userData.pairId : undefined,
        teamId: userData?.teamId !== null ? userData.teamId : undefined,
      })
    } else {
      return undefined
    }
  }

  public async findByUserId(userId: UserId): Promise<UserEntity | undefined> {
    const userData = await prisma.user.findUnique({
      where: { userId: userId.value },
    })
    if (userData !== null) {
      return UserFactory.create({
        ...userData,
        pairId: userData?.pairId !== null ? userData.pairId : undefined,
        teamId: userData?.teamId !== null ? userData.teamId : undefined,
      })
    } else {
      throw new Error('Not Found.')
    }
  }

  public async exists(email: Email): Promise<boolean> {
    const userData = await prisma.user.findUnique({
      where: { email: email.value },
    })
    if (userData) {
      return true
    } else {
      return false
    }
  }
}
