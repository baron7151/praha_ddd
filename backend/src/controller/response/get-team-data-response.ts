import { ApiProperty } from '@nestjs/swagger'
import { PairDataDTO } from 'src/app/query-service-interface/pair-data-qs'
import { TeamDataDTO } from 'src/app/query-service-interface/team-data-qs'

export class GetTeamDataResponse {
  @ApiProperty({ type: () => [TeamData] })
  public teamDatas: TeamData[]
  constructor(params: { teamDataDTO: TeamDataDTO[] }) {
    const { teamDataDTO } = params
    this.teamDatas = teamDataDTO.map(({ teamId, teamName, pairs }) => {
      return new TeamData({
        team_id: teamId,
        team_name: teamName,
        pairs: pairs
          ? pairs.map(
              (pair) =>
                new Pair({
                  pair_id: pair.pairId,
                  pair_name: pair.pairName,
                }),
            )
          : [],
      })
    })
  }
}

export class TeamData {
  @ApiProperty()
  team_id: string

  @ApiProperty()
  team_name: string

  @ApiProperty()
  pairs: Pair[]

  public constructor(params: {
    team_id: string
    team_name: string
    pairs: Pair[]
  }) {
    this.team_id = params.team_id
    this.team_name = params.team_name
    this.pairs = params.pairs
  }
}

class Pair {
  public readonly pair_id: string
  public readonly pair_name: string
  public constructor(params: { pair_id: string; pair_name: string }) {
    this.pair_id = params.pair_id
    this.pair_name = params.pair_name
  }
}
