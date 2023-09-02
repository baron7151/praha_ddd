import { Inject } from '@nestjs/common'
import { UserEntity, UserId, UserName, UserStatus } from './user-entity'
import { TeamId, TeamName } from '../team/team-entity'

export class UserService {
  constructor() {}
  static notifyWithTeamMemberDecrease(
    teamName: TeamName,
    teamUserNames: UserName[],
    changeStatusUserName: UserName,
  ) {
    console.log(
      `参加者の退会・休会に伴い、チームが２名以下になりましたので、お知らせします。\n退会・休会会員：${
        changeStatusUserName.value
      }\nチーム名：${
        teamName.value
      }\nチームの現在の参加者名：${teamUserNames.map(
        (teamUserName) => teamUserName.value,
      )}`,
    )
  }
  static notifyNotFoundMovePair(
    changeStatusUserName: UserName,
    moveUserNames: UserName[],
  ) {
    console.log(
      `参加者の退会・休会に伴い、ペアの移動が必要になった参加者がいましたが、移動先のペアが見つかりませんでした。\n退会・休会会員：${
        changeStatusUserName.value
      }\n移動が必要な参加者名：${moveUserNames.map(
        (moveUserName) => moveUserName.value,
      )}`,
    )
  }
}
