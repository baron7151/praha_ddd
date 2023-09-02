import { Injectable, Inject } from '@nestjs/common'
import { PairId } from 'src/domain/pair/pair-entity'
import { IPairRepository } from 'src/domain/pair/pair-repository'
import { PairService } from 'src/domain/pair/pair-service'
import { TeamId } from 'src/domain/team/team-entity'
import { ITeamRepository } from 'src/domain/team/team-repository'
import { TeamService } from 'src/domain/team/team-service'
import {
  UserEntity,
  UserId,
  UserName,
  UserStatus,
} from 'src/domain/user/user-entity'
import { UserFactory } from 'src/domain/user/user-factory'
import { IUserRepository } from 'src/domain/user/user-repository'
import { UserService } from 'src/domain/user/user-service'
import { Providers } from 'src/providers'
@Injectable()
export class PatchUserDataUseCase {
  public constructor(
    @Inject(Providers.IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @Inject(Providers.ITeamRepository)
    private teamRepository: ITeamRepository,
    @Inject(Providers.IPairRepository) private pairRepository: IPairRepository,
    @Inject(PairService) private pairService: PairService,
    @Inject(TeamService) private teamService: TeamService,
  ) {}
  public async do(data: {
    userId: string
    userName?: string
    email?: string
    status?: string
  }): Promise<void> {
    const { userId, email, userName, status } = data
    let userEntity = await this.userRepository.findByUserId(new UserId(userId))
    if (userEntity !== undefined) {
      if (status && UserEntity.isStringInUserStatus(status)) {
        await this.saveChangeUserStatus(userEntity, status as UserStatus)
        userEntity = userEntity.changeStatus(status as UserStatus)
      }
      if (email || userName) {
        const newUserEntity = await this.userFactory.reconstruct({
          userEntity: userEntity,
          newUserName: userName,
          newEmail: email,
        })
        await this.userRepository.save(newUserEntity)
      }
    } else {
      throw new Error('Not Found.')
    }
  }
  async saveChangeUserStatus(userEntity: UserEntity, newStatus: UserStatus) {
    const { userId, userName, email, status, pairId, teamId } =
      userEntity.getAllProperties()
    if (newStatus == UserStatus.ACTIVE) {
      if (status == UserStatus.INACTIVE) {
        /*
        休会中の参加者が復帰した（在籍ステータス「在籍中」に切り替わった）際に所属するチームとペアは、最も参加人数が少ないチームの中で、
        最も参加人数が少ないペアから自動的に選ばれる参加人数が同じの場合はランダムに選択する
        */
        let movePairId: PairId
        let moveTeamId: TeamId
        const mostFewMemberTeamEntity =
          await this.teamService.findMostFewMemberTeam()
        if (mostFewMemberTeamEntity !== undefined) {
          const mostFewMemberPairEntity =
            await this.pairService.findMostFewMemberPairByTeamId(
              mostFewMemberTeamEntity.getId(),
            )
          if (mostFewMemberPairEntity !== undefined) {
            if (mostFewMemberPairEntity.isMaximumMember()) {
              //参加者が増えることでペアが 4 名になってしまう場合、自動的にペアを２つに分解する。
              const autoCreatePair = await this.pairService.autoPairCreate()
              const newPair = autoCreatePair.changeTeam(
                mostFewMemberTeamEntity.getId(),
              )
              await this.pairRepository.save(newPair)

              //登録したペアにメンバーを移動する
              //ステータス変更メンバーを新規作成したペアに登録
              movePairId = newPair.getId()
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

              //分解元のペアから新規作成したペアに移動する
              const moveUserId = mostFewMemberPairEntity.selectUserAtRandom()!
              const moveUser = await this.userRepository.findByUserId(
                moveUserId,
              )
              const moveUserChangePairTeam = moveUser!
                .changePair(movePairId)
                .changeTeam(moveTeamId)
              await this.userRepository.save(moveUserChangePairTeam)
            } else {
              movePairId = mostFewMemberPairEntity.getId()
              moveTeamId = mostFewMemberTeamEntity.getId()
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
          } else {
            throw new Error('Failed to find moveable Pair.')
          }
        } else {
          throw new Error('Failed to find moveable Team.')
        }
      } else if (status == UserStatus.DELETE) {
        throw new Error('The user status of a DELETE member cannot be changed.')
      }
    } else if (newStatus === UserStatus.DELETE || UserStatus.INACTIVE) {
      if (status === UserStatus.ACTIVE) {
        if (teamId) {
          const team = await this.teamRepository.findByTeamId(teamId)
          if (team !== undefined && team.isMinimumMember()) {
            const userEntities = await this.userRepository.findByTeamId(
              team.getId(),
            )
            let otherTeamUserNames = undefined
            const teamUserNames = userEntities!.map(
              (userEntity) => userEntity!.getAllProperties().userName,
            )
            otherTeamUserNames = teamUserNames.filter(
              (name) => name.equals(userName) === false,
            )
            const teamName = team.getAllProperties().teamName
            UserService.notifyWithTeamMemberDecrease(
              teamName,
              otherTeamUserNames,
              userName,
            )
          }
        }
        if (pairId) {
          await this.movePairMemberWithPairMemberDecrease(
            userId,
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
    } else {
      throw Error('Incorrect UserStatus specified.')
    }
  }
  async movePairMemberWithPairMemberDecrease(
    moveUserId: UserId,
    moveUserPairId: PairId,
    changeStatusUserName: UserName,
  ) {
    // 対象ペアに残るメンバーが移動対象になるか確認
    let moveUserNames
    const moveUserPair = await this.pairRepository.findByPairId(moveUserPairId)
    if (moveUserPair !== undefined) {
      const moveUserIds = moveUserPair
        .getAllProperties()
        .userIds?.filter((userId) => userId.equals(moveUserId) === false)
      if (moveUserIds !== undefined) {
        const moveUsers = (await this.userRepository.findByManyUserIds(
          moveUserIds,
        )) as UserEntity[]
        moveUserNames = moveUsers!.map(
          (moveUser) => moveUser.getAllProperties().userName,
        )
        if (moveUserPair.isMinimumMember()) {
          if (moveUserPair.isBelongingToTeam()) {
            const moveUserTeamId = moveUserPair.getAllProperties().teamId!
            const moveUserOtherPairs = (await this.pairRepository.findByTeamId(
              moveUserTeamId,
            ))!.filter(
              (pairEntity) => pairEntity.getId().value !== moveUserPairId.value,
            )
            const moveablePair = PairService.findMovablePair(moveUserOtherPairs)
            if (moveablePair !== undefined && moveUserOtherPairs.length !== 0) {
              await Promise.all(
                moveUsers.map((moveUser) =>
                  this.userRepository.save(
                    moveUser.changePair(moveablePair.getId()),
                  ),
                ),
              )
            } else {
              UserService.notifyNotFoundMovePair(
                changeStatusUserName,
                moveUserNames,
              )
            }
          } else {
            UserService.notifyNotFoundMovePair(
              changeStatusUserName,
              moveUserNames,
            )
          }
        }
      }
    }
  }
}
