import { Injectable } from '@nestjs/common'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from 'src/domain/team/team-entity'
import { TeamFactory } from 'src/domain/team/team-factory'
import { ITeamRepository } from 'src/domain/team/team-repository'
import { UserId } from 'src/domain/user/user-entity'
import { prisma } from 'src/prisma'

@Injectable()
export class TeamRepository implements ITeamRepository {
  public async save(saveTeamEntity: TeamEntity): Promise<void> {
    const { teamId, teamName } = saveTeamEntity.getAllProperties()
    const teamData = {
      teamId: teamId.value,
      teamName: teamName.value,
    }
    await prisma.$transaction(async (tx) => {
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
        await tx.team.update({
          where: { teamId: teamId.value },
          data: {
            teamName: teamName.value,
          },
        })
      }
    })
  }

  public async findByTeamId(teamId: TeamId): Promise<TeamEntity | undefined> {
    const teamData = await prisma.team.findUnique({
      where: { teamId: teamId.value },
      include: { pair: true, user: true },
    })
    if (teamData !== null) {
      return TeamFactory.create({
        teamId: teamData.teamId,
        teamName: teamData.teamName,
        pairIds: teamData.pair.map((pair) => pair.pairId),
        userIds: teamData.user.map((user) => user.userId),
      })
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
  public async findAllTeams(): Promise<TeamEntity[] | undefined> {
    const teamDatas = await prisma.team.findMany({
      include: { pair: true, user: true },
    })
    if (teamDatas !== null) {
      return teamDatas.map((teamData) =>
        TeamFactory.create({
          teamId: teamData.teamId,
          teamName: teamData.teamName,
          pairIds: teamData.pair.map((pair) => pair.pairId),
          userIds: teamData.user.map((user) => user.userId),
        }),
      )
    } else {
      return undefined
    }
  }
}
