import { ApiProperty } from '@nestjs/swagger'
import { UserDataDTO } from 'src/app/query-service-interface/user-data-qs'

export class GetUserDataResponse {
  @ApiProperty({ type: () => [UserData] })
  userData: UserData[]

  public constructor(params: { userDatas: UserDataDTO[] }) {
    const { userDatas } = params
    this.userData = userDatas.map(({ userId, name, email, status }) => {
      return new UserData({
        userId,
        name,
        email,
        status,
      })
    })
  }
}

export class UserData {
  @ApiProperty()
  userId: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  status: string

  public constructor(params: {
    userId: string
    name: string
    email: string
    status: string
  }) {
    this.userId = params.userId
    this.name = params.name
    this.email = params.email
    this.status = params.status
  }
}
