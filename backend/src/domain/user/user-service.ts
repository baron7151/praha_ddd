import { Inject } from '@nestjs/common'
import { UserEntity, UserId, UserName, UserStatus } from './user-entity'
import { IUserRepository } from './user-repository'
import { Providers } from 'src/providers'
import { DomainError } from '../common/domain-error'
import { ITeamRepository } from '../team/team-repository'
import { TeamId, TeamName } from '../team/team-entity'
import { IPairRepository } from '../pair/pair-repository'
import { PairId } from '../pair/pair-entity'
import { PairService } from '../pair/pair-service'
import { TeamService } from '../team/team-service'

export class UserService {
  constructor() {}
  // async changeUserStatus(userEntity: UserEntity, newStatus: UserStatus) {
  //   const { userId, userName, email, status, pairId, teamId } =
  //     userEntity.getAllProperties()
  //   if (newStatus === UserStatus.ACTIVE) {
  //     if (status === UserStatus.INACTIVE) {
  //       //TODO
  //       /*
  //       休会中の参加者が復帰した（在籍ステータス「在籍中」に切り替わった）際に所属するチームとペアは、最も参加人数が少ないチームの中で、最も参加人数が少ないペアから自動的に選ばれる
  //       参加人数が同じの場合はランダムに選択する
  //       参加者が増えることでペアが 4 名になってしまう場合、自動的に 2 つのペアに分解する必要がある
  //       分解する仕様の指定はないので、新しいペアはランダムに選択して構わない
  //       */
  //       let movePairId: PairId
  //       let moveTeamId: TeamId
  //       const mostFewMemberTeamEntity =
  //         await this.teamService.findMostFewMemberTeam()
  //       if (mostFewMemberTeamEntity !== undefined) {
  //         const mostFewMemberPairEntity =
  //           await this.pairService.findMostFewMemberPairByTeamId(
  //             mostFewMemberTeamEntity.getId(),
  //           )
  //         if (mostFewMemberPairEntity !== undefined) {
  //           if (mostFewMemberPairEntity.isMaximumMember()) {
  //             //pair分解の処理を実行
  //             //pairを新規作成
  //             const autoCreatePair = await this.pairService.autoPairCreate()
  //             const newPair = autoCreatePair.changeTeam(
  //               mostFewMemberTeamEntity.getId(),
  //             )
  //             await this.

  //             //登録したペアにメンバーを移動する
  //             //ステータス変更メンバーを新規作成したペアに登録
  //             movePairId = newPair.getId()
  //             moveTeamId = newPair.getAllProperties().teamId!
  //             const changeStatusUser = new UserEntity(
  //               userId,
  //               userName,
  //               email,
  //               newStatus,
  //               movePairId,
  //               moveTeamId,
  //             )
  //             await this.userRepository.save(changeStatusUser)

  //             //分解元のペアから新規作成したペアに移動する
  //             const moveUserId = mostFewMemberPairEntity.selectUserAtRandom()!
  //             const moveUser = await this.userRepository.findByUserId(
  //               moveUserId,
  //             )
  //             const moveUserChangePairTeam = moveUser!
  //               .changePair(movePairId)
  //               .changeTeam(moveTeamId)
  //             await this.userRepository.save(moveUserChangePairTeam)
  //           } else {
  //             movePairId = mostFewMemberPairEntity.getId()
  //             moveTeamId = mostFewMemberTeamEntity.getId()
  //             const changeStatusUser = new UserEntity(
  //               userId,
  //               userName,
  //               email,
  //               newStatus,
  //               movePairId,
  //               moveTeamId,
  //             )
  //             await this.userRepository.save(changeStatusUser)
  //           }
  //         } else {
  //           throw new DomainError('Failed to find moveable Pair.')
  //         }
  //       } else {
  //         throw new DomainError('Failed to find moveable Team.')
  //       }
  //     } else if (status === UserStatus.DELETE) {
  //       throw new DomainError(
  //         'The user status of a DELETE member cannot be changed.',
  //       )
  //     }
  //   } else if (newStatus === UserStatus.DELETE || UserStatus.INACTIVE) {
  //     if (status === UserStatus.ACTIVE) {
  //       if (teamId) {
  //         await this.notifyWithTeamMemberDecrease(teamId, userName)
  //       }
  //       if (pairId) {
  //         await this.pairService.movePairMemberWithPairMemberDecrease(
  //           pairId,
  //           userName,
  //         )
  //       }
  //     }
  //     const changeUserStatusEntity = new UserEntity(
  //       userId,
  //       userName,
  //       email,
  //       newStatus,
  //     )
  //     await this.userRepository.save(changeUserStatusEntity)
  //   }
  // }
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
      )}}`,
    )
  }
}
