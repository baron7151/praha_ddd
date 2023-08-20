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
    const { pairId, pairName, teamId } = savePairEntity.getAllProperties()
    const pairData = {
      pairId: pairId.value,
      pairName: pairName.value,
      teamId: teamId?.value,
    }
    await prisma.$transaction(async (tx) => {
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
        await tx.pair.update({
          where: { pairId: pairId.value },
          data: {
            pairName: pairName.value,
            teamId: teamId !== undefined ? teamId.value : null,
          },
        })
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
        userIds:
          pairData.user !== undefined
            ? pairData.user.map((user) => user.userId)
            : undefined,
      })
    } else {
      return undefined
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
          userIds:
            pairData.user !== undefined
              ? pairData.user.map((user) => user.userId)
              : undefined,
        }),
      )
    } else {
      return undefined
    }
  }
}
