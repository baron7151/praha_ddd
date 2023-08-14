import { Injectable } from '@nestjs/common'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from 'src/domain/team/team-entity'
import { ITeamRepository } from 'src/domain/team/team-repository'
import { prisma } from 'src/prisma'

@Injectable()
export class TeamRepository implements ITeamRepository {
  public async save(saveTeamEntity: TeamEntity): Promise<void> {
    const { teamId, teamName, pairIds } = saveTeamEntity.getAllProperties()
    const teamData = {
      teamId: teamId.value,
      teamName: teamName.value,
      ...(pairIds !== undefined && {
        pair: {
          connect: pairIds.map((pairId) => ({ pairId: pairId.value })),
        },
      }),
    }
    await prisma.$transaction(async (tx) => {
      if (pairIds !== undefined) {
        const pair = await tx.pair.findMany({
          where: { pairId: { in: pairIds.map((pairId) => pairId.value) } },
        })
        if (pair.length !== pairIds.length) {
          throw new Error('do not found pairId')
        }
      }
      const result = await tx.team.findUnique({
        where: { teamId: teamId.value },
      })
      if (result === null) {
        await tx.team.create({
          data: {
            ...teamData,
          },
        })
      } else {
        await tx.team.delete({ where: { teamId: teamId.value } })
        await tx.team.create({ data: { ...teamData } })
      }
    })
  }

  public async findByTeamId(teamId: TeamId): Promise<TeamEntity | undefined> {
    const teamData = await prisma.team.findUnique({
      where: { teamId: teamId.value },
      include: { pair: true },
    })
    if (teamData !== null) {
      return new TeamEntity(
        new TeamId(teamData.teamId),
        new TeamName(teamData.teamName),
        teamData.pair.map(({ pairId }) => new PairId(pairId)),
      )
    } else {
      return undefined
    }
  }

  public async exists(teamName: TeamName): Promise<boolean> {
    const teamData = await prisma.team.findUnique({
      where: { teamName: teamName.value },
    })
    if (teamData) {
      return true
    } else {
      return false
    }
  }
}
