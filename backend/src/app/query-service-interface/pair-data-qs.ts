import { UserDataDTO } from './user-data-qs'

export class PairDataDTO {
  public readonly pairId: string
  public readonly pairName: string
  public readonly teamId?: string
  public readonly users?: UserDataDTO[]
  public constructor(props: {
    pairId: string
    pairName: string
    teamId?: string
    users?: UserDataDTO[]
  }) {
    const { pairId, pairName, teamId, users } = props
    this.pairId = pairId
    this.pairName = pairName
    this.teamId = teamId
    this.users = users
  }
}

export interface IPairDataQS {
  getAllPairs(): Promise<PairDataDTO[]>
}
