import { ApiProperty } from '@nestjs/swagger'
import { UserDataDTO } from 'src/app/query-service-interface/user-data-qs'

export class GetUserDataResponse {
  @ApiProperty({ type: () => [UserData] })
  userData: UserData[]

  public constructor(params: { userDatas: UserDataDTO[] }) {
    const { userDatas } = params
    this.userData = userDatas.map(
      ({ userId, userName, email, status, pairId, teamId }) => {
        return new UserData({
          user_id: userId,
          user_name: userName,
          email,
          status,
          pair_id: pairId,
          team_id: teamId,
        })
      },
    )
  }
}

export class UserData {
  @ApiProperty()
  user_id: string

  @ApiProperty()
  user_name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  status: string

  @ApiProperty()
  pair_id?: string

  @ApiProperty()
  team_id?: string

  public constructor(params: {
    user_id: string
    user_name: string
    email: string
    status: string
    pair_id?: string
    team_id?: string
  }) {
    this.user_id = params.user_id
    this.user_name = params.user_name
    this.email = params.email
    this.status = params.status
    this.pair_id = params.pair_id
    this.team_id = params.team_id
  }
}
