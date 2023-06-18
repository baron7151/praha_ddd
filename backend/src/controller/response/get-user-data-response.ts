import { ApiProperty } from '@nestjs/swagger'
import { UserDataDTO } from 'src/domain/user/user-dto'

export class GetUserDataResponse {
  @ApiProperty({ type: () => [UserData] })
  userData: UserData[]

  public constructor(params: { userDatas: UserDataDTO[] }) {
    const { userDatas } = params
    this.userData = userDatas.map(({ userId, userName, email, status }) => {
      return new UserData({
        userId,
        user_name: userName,
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
  user_name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  status: string

  public constructor(params: {
    userId: string
    user_name: string
    email: string
    status: string
  }) {
    this.userId = params.userId
    this.user_name = params.user_name
    this.email = params.email
    this.status = params.status
  }
}
