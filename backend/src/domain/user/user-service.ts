import { Inject } from '@nestjs/common'
import { UserEntity, UserId, UserName, UserStatus } from './user-entity'
import { IUserRepository } from './user-repository'
import { Providers } from 'src/providers'
import { DomainError } from '../common/domain-error'
import { ITeamRepository } from '../team/team-repository'
import { TeamId } from '../team/team-entity'
import { IPairRepository } from '../pair/pair-repository'
import { MAX_PAIR_USER, MIN_PAIR_USER, PairId } from '../pair/pair-entity'
import { Pair } from '@prisma/client'
import { PairService } from '../pair/pair-service'
import { UserFactory } from './user-factory'
import { TeamService } from '../team/team-service'
import { createTracing } from 'trace_events'

export class UserService {
  constructor(
    @Inject(Providers.ITeamRepository)
    private teamRepository: ITeamRepository,
    @Inject(Providers.IUserRepository) private userRepository: IUserRepository,
    @Inject(Providers.IPairRepository) private pairRepository: IPairRepository,
    @Inject(PairService) private pairService: PairService,
    @Inject(TeamService) private teamService: TeamService,
  ) {}
  async changeUserStatus(userEntity: UserEntity, newStatus: UserStatus) {
    const { userId, userName, email, status, pairId, teamId } =
      userEntity.getAllProperties()
    if (newStatus === UserStatus.ACTIVE) {
      if (status === UserStatus.INACTIVE) {
        //TODO
        /*
        休会中の参加者が復帰した（在籍ステータス「在籍中」に切り替わった）際に所属するチームとペアは、最も参加人数が少ないチームの中で、最も参加人数が少ないペアから自動的に選ばれる
        参加人数が同じの場合はランダムに選択する
        参加者が増えることでペアが 4 名になってしまう場合、自動的に 2 つのペアに分解する必要がある
        分解する仕様の指定はないので、新しいペアはランダムに選択して構わない
        */
        let movePairId: PairId
        let moveTeamId: TeamId
        const mostFewMemberTeamEntity =
          await this.teamService.findMostFewMemberTeam()
        if (mostFewMemberTeamEntity !== undefined) {
          const mostFewMemberPairEntity =
            await this.pairService.findMostFewMemberPairByTeamId(
              mostFewMemberTeamEntity.getAllProperties().teamId,
            )
          if (mostFewMemberPairEntity !== undefined) {
            if (
              mostFewMemberPairEntity.getAllProperties().userIds!.length >=
              MAX_PAIR_USER
            ) {
              //pair分解の処理を実行
              //pairを新規作成
              const autoCreatePair = await this.pairService.autoPairCreate()
              const newPair = autoCreatePair.changeTeam(
                mostFewMemberTeamEntity.getAllProperties().teamId,
              )
              await this.pairRepository.save(newPair)
              //登録したペアにメンバーを移動する
              //ステータス変更メンバーの登録
              movePairId = newPair.getAllProperties().pairId
              moveTeamId = newPair.getAllProperties().teamId!
              const changeStatusUser = new UserEntity(
                userId,
                userName,
                email,
                newStatus,
                movePairId,
                moveTeamId,
              )
              await this.userRepository.save(changeStatusUser)
              const moveUserId =
                mostFewMemberPairEntity.getAllProperties().userIds![0]!
              const moveUser = await this.userRepository.findByUserId(
                moveUserId,
              )
              const moveUserChangePairTeam = moveUser!
                .changePair(movePairId)
                .changeTeam(moveTeamId)
              await this.userRepository.save(moveUserChangePairTeam)
            } else {
              movePairId = mostFewMemberPairEntity.getAllProperties().pairId
              moveTeamId = mostFewMemberTeamEntity.getAllProperties().teamId
              const changeStatusUser = new UserEntity(
                userId,
                userName,
                email,
                newStatus,
                movePairId,
                moveTeamId,
              )
              await this.userRepository.save(changeStatusUser)
            }
          }
        }
      } else if (status === UserStatus.DELETE) {
        throw new DomainError(
          'The user status of a DELETE member cannot be changed.',
        )
      }
    } else if (newStatus === UserStatus.DELETE || UserStatus.INACTIVE) {
      if (status === UserStatus.ACTIVE) {
        if (teamId) {
          await this.notifyWithTeamParticipantDecrease(teamId, userName)
        }
        if (pairId) {
          await this.pairService.movePairMemberWithPairMemberDecrease(
            pairId,
            userName,
          )
        }
      }
      const changeUserStatusEntity = new UserEntity(
        userId,
        userName,
        email,
        newStatus,
      )
      await this.userRepository.save(changeUserStatusEntity)
    }
  }
  async notifyWithTeamParticipantDecrease(
    teamId: TeamId,
    changeStatusUserName: UserName,
  ) {
    const team = await this.teamRepository.findByTeamId(teamId)
    if (
      team !== undefined &&
      team.getAllProperties().userIds !== undefined &&
      team.getAllProperties().userIds!.length <= 3
    ) {
      // 管理者メールを送る処理
      const userEntitys = await Promise.all(
        team
          .getAllProperties()
          .userIds!.map((userId) => this.userRepository.findByUserId(userId)),
      )
      let userNames = undefined
      if (userEntitys !== undefined) {
        userNames = userEntitys.map(
          (userEntity) => userEntity!.getAllProperties().userName.value,
        )
      }
      const teamName = team.getAllProperties().teamName.value
      console.log(
        `参加者の退会・休会に伴い、チームが２名以下になりましたので、お知らせします。\n退会・休会会員：${changeStatusUserName.value}\nチーム名：${teamName}\nチームの現在の参加者名：${userNames}`,
      )
    }
  }
}
