import { Injectable } from '@nestjs/common'

import { prisma } from 'src/prisma'
import {
  ITeamDataQS,
  TeamDataDTO,
} from 'src/app/query-service-interface/team-data-qs'
import { UserDataDTO } from 'src/app/query-service-interface/user-data-qs'
import { PairDataDTO } from 'src/app/query-service-interface/pair-data-qs'

@Injectable()
export class TeamDataQS implements ITeamDataQS {
  public async getAllTeams(): Promise<TeamDataDTO[]> {
    const teams = await prisma.team.findMany({
      include: { pair: true },
    })
    return teams.map(
      (team) =>
        new TeamDataDTO({
          teamId: team.teamId,
          teamName: team.teamName,
          pairs: team.pair.map(
            (pair) =>
              new PairDataDTO({
                pairId: pair.pairId,
                pairName: pair.pairName,
              }),
          ),
        }),
    )
  }
}
