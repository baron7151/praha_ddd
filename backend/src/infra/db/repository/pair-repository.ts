import { IPairRepository } from 'src/domain/pair/pair-repository'
import { Injectable } from '@nestjs/common'
import { PairEntity, PairId, PairName } from 'src/domain/pair/pair-entity'
import { UserId } from 'src/domain/user/user-entity'
import { prisma } from 'src/prisma'
import { TeamId } from 'src/domain/team/team-entity'
import { PairService } from 'src/domain/pair/pair-service'

@Injectable()
export class PairRepository implements IPairRepository {
  public async save(savePairEntity: PairEntity): Promise<void> {
    const { pairId, pairName, teamId, userIds } =
      savePairEntity.getAllProperties()
    const pairData = {
      pairId: pairId.value,
      pairName: pairName.value,
      teamId: teamId?.value,
      ...(userIds !== undefined && {
        user: {
          connect: userIds.map((userId) => ({ userId: userId.value })),
        },
      }),
    }
    await prisma.$transaction(async (tx) => {
      if (userIds !== undefined) {
        const user = await tx.user.findMany({
          where: { userId: { in: userIds.map((userId) => userId.value) } },
        })
        if (user.length !== userIds.length) {
          throw new Error('do not found userId')
        }
      }
      const result = await tx.pair.findUnique({
        where: { pairId: pairId.value },
      })
      if (result === null) {
        await tx.pair.create({
          data: {
            ...pairData,
          },
        })
      } else {
        await tx.pair.delete({ where: { pairId: pairId.value } })
        await tx.pair.create({ data: { ...pairData } })
      }
    })
  }

  public async findByPairId(pairId: PairId): Promise<PairEntity | undefined> {
    const pairData = await prisma.pair.findUnique({
      where: { pairId: pairId.value },
      include: { user: true },
    })
    if (pairData !== null) {
      return PairEntity.create({
        pairId: pairData.pairId,
        pairName: pairData.pairName,
        teamId: pairData.teamId,
        userIds: pairData.user.map((user) => user.userId),
      })
    } else {
      return undefined
      //throw new Error('Not Found.')
    }
  }

  public async exists(pairName: PairName): Promise<boolean> {
    const pairData = await prisma.pair.findUnique({
      where: { pairName: pairName.value },
    })
    if (pairData) {
      return true
    } else {
      return false
    }
  }
  public async findByTeamId(teamId: TeamId): Promise<PairEntity[] | undefined> {
    const pairDatas = await prisma.pair.findMany({
      where: { teamId: teamId.value },
      include: { user: true },
    })
    if (pairDatas !== null) {
      return pairDatas.map((pairData) =>
        PairEntity.create({
          pairId: pairData.pairId,
          pairName: pairData.pairName,
          teamId: pairData.teamId,
          userIds: pairData.user.map((user) => user.userId),
        }),
      )
    } else {
      return undefined
    }
  }
}
