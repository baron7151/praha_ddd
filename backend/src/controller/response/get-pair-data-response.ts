import { ApiProperty } from '@nestjs/swagger'
import { PairDataDTO } from 'src/app/query-service-interface/pair-data-qs'
import { UserData } from './get-user-data-response'

export class GetPairDataResponse {
  @ApiProperty({ type: () => [PairData] })
  public pairDatas: PairData[]
  constructor(params: { pairDataDTO: PairDataDTO[] }) {
    const { pairDataDTO } = params
    this.pairDatas = pairDataDTO.map(({ pairId, pairName, teamId, users }) => {
      return new PairData({
        pair_id: pairId,
        pair_name: pairName,
        team_id: teamId,
        users: users
          ? users.map(
              (user) =>
                new UserData({
                  user_id: user.userId,
                  user_name: user.userName,
                  email: user.email,
                  status: user.status,
                  pair_id: user.pairId,
                  team_id: user.teamId,
                }),
            )
          : [],
      })
    })
  }
}

export class PairData {
  @ApiProperty()
  pair_id: string

  @ApiProperty()
  pair_name: string

  @ApiProperty()
  team_id?: string

  @ApiProperty()
  users: UserData[]

  public constructor(params: {
    pair_id: string
    pair_name: string
    team_id?: string
    users: UserData[]
  }) {
    this.pair_id = params.pair_id
    this.pair_name = params.pair_name
    this.team_id = params.team_id
    this.users = params.users
  }
}

// class User {
//   public user_id: string
//   public user_name: string
//   public email: string
//   public status: string
//   public pair_id?: string
//   public constructor(params: {
//     user_id: string
//     user_name: string
//     email: string
//     status: string
//   }) {
//     this.user_id = params.user_id
//     this.user_name = params.user_name
//     this.email = params.email
//     this.status = params.status
//   }
// }
