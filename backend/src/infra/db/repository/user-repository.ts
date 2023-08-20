import { IUserRepository } from 'src/domain/user/user-repository'

import { Injectable } from '@nestjs/common'
import { UserEntity, UserId } from 'src/domain/user/user-entity'
import { UserFactory } from 'src/domain/user/user-factory'
import { Email } from 'src/domain/common/email'
import { prisma } from 'src/prisma'
import { TeamId } from 'src/domain/team/team-entity'
import { PairId } from 'src/domain/pair/pair-entity'
import { User } from '@prisma/client'

@Injectable()
export class UserRepository implements IUserRepository {
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
      })
    } else {
      return undefined
    }
  }

  public async findByManyUserIds(
    userIds: UserId[],
  ): Promise<UserEntity[] | undefined> {
    const userDatas = (
      await Promise.all(
        userIds.map((userId) =>
          prisma.user.findUnique({
            where: { userId: userId.value },
          }),
        ),
      )
    ).filter((item: User | null): item is User => item !== null)
    if (userDatas.length !== 0) {
      return userDatas.map((userData) => {
        return UserFactory.create({
          ...userData,
        })
      })
    } else {
      return undefined
    }
  }
  public async findByTeamId(teamId: TeamId): Promise<UserEntity[] | undefined> {
    const userDatas = await prisma.user.findMany({
      where: { teamId: teamId.value },
    })
    if (userDatas !== null) {
      return userDatas.map((userData) => {
        return UserFactory.create({
          ...userData,
        })
      })
    } else {
      return undefined
    }
  }

  public async findByPairId(pairId: PairId): Promise<UserEntity[] | undefined> {
    const userDatas = await prisma.user.findMany({
      where: { pairId: pairId.value },
    })
    if (userDatas !== null) {
      return userDatas.map((userData) => {
        return UserFactory.create({
          ...userData,
        })
      })
    } else {
      return undefined
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
