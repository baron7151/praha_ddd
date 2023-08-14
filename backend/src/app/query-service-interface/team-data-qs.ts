import { PairDataDTO } from './pair-data-qs'

export class TeamDataDTO {
  public readonly teamId: string
  public readonly teamName: string
  public readonly pairs?: PairDataDTO[]
  public constructor(props: {
    teamId: string
    teamName: string
    pairs?: PairDataDTO[]
  }) {
    const { teamId, teamName, pairs } = props
    this.teamId = teamId
    this.teamName = teamName
    this.pairs = pairs
  }
}

export interface ITeamDataQS {
  getAllTeams(): Promise<TeamDataDTO[]>
}
