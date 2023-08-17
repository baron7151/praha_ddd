import { Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import { IPairRepository } from './pair-repository'
import {
  MAX_PAIR_USER,
  MIN_PAIR_USER,
  PairEntity,
  PairId,
  PairName,
} from './pair-entity'
import { ITeamRepository } from '../team/team-repository'
import { UserEntity, UserId, UserName } from '../user/user-entity'
import { IUserRepository } from '../user/user-repository'
import { TeamId } from '../team/team-entity'
import { DomainError } from '../common/domain-error'

export class PairService {
  constructor(
    @Inject(Providers.IPairRepository)
    private pairRepository: IPairRepository,
    @Inject(Providers.ITeamRepository)
    private teamRepository: ITeamRepository,
    @Inject(Providers.IUserRepository) private userRepository: IUserRepository,
  ) {}
  async movePairMemberWithPairMemberDecrease(
    pairId: PairId,
    changeStatusUserName: UserName,
  ) {
    // 対象ペアに残るメンバーが移動対象になるか確認
    const pair = await this.pairRepository.findByPairId(pairId)
    if (
      pair !== undefined &&
      pair.getAllProperties().userIds !== undefined &&
      pair.getAllProperties().userIds!.length <= MIN_PAIR_USER
    ) {
      const teamId = pair.getAllProperties().teamId
      if (teamId !== undefined) {
        const team = await this.teamRepository.findByTeamId(teamId)
        if (team?.getAllProperties().pairIds !== undefined) {
          const pairEntitysContainedUndefined = await Promise.all(
            team
              .getAllProperties()
              .pairIds!.map((pairId) =>
                this.pairRepository.findByPairId(pairId),
              ),
          )
          const pairEntitys: PairEntity[] =
            pairEntitysContainedUndefined.filter(
              (item: PairEntity | undefined): item is PairEntity =>
                item !== undefined,
            )
          //移動可能なペアを探す
          const moveablePairId = PairService.findMovablePair(pairEntitys)
          if (moveablePairId !== undefined) {
            const moveablePairEntity = await this.pairRepository.findByPairId(
              moveablePairId,
            )
            if (moveablePairEntity !== undefined) {
              const moveUserIds = moveablePairEntity.getAllProperties().userIds
              if (moveUserIds !== undefined) {
                const moveUserEntitysContainedUndefined = await Promise.all(
                  moveUserIds!.map((userId) =>
                    this.userRepository.findByUserId(userId),
                  ),
                )
                const moveUserEntitys: UserEntity[] =
                  moveUserEntitysContainedUndefined.filter(
                    (item: UserEntity | undefined): item is UserEntity =>
                      item !== undefined,
                  )
                await Promise.all(
                  moveUserEntitys.map((userEntity) =>
                    this.userRepository.save(
                      userEntity.changePair(moveablePairId),
                    ),
                  ),
                )
              }
            }
          } else {
            //移動が必要な参加者の名前を取得
            const moveUserIds = pair.getAllProperties().userIds
            if (moveUserIds !== undefined) {
              const moveUserEntityContainsUndefined = await Promise.all(
                moveUserIds!.map((userId) =>
                  this.userRepository.findByUserId(userId),
                ),
              )
              const moveUserEntitys: UserEntity[] =
                moveUserEntityContainsUndefined.filter(
                  (item: UserEntity | undefined): item is UserEntity =>
                    item !== undefined,
                )
              const moveUserNames: string[] = moveUserEntitys.map(
                (userEntity) => userEntity.getAllProperties().userName.value,
              )
              console.log(
                `参加者の退会・休会に伴い、ペアの移動が必要になった参加者がいましたが、移動先のペアが見つかりませんでした。\n退会・休会会員：${changeStatusUserName.value}\n移動が必要な参加者名：${moveUserNames}}`,
              )
            }
          }
        }
      }
    }
  }

  static findMovablePair(pairEntitys: PairEntity[]): PairId | undefined {
    let minUserNumber = Number.MAX_SAFE_INTEGER
    let minUserNumberPairId
    let userNumber
    pairEntitys.forEach((pairEntity) => {
      userNumber = pairEntity.getAllProperties().userIds?.length
      if (
        userNumber !== undefined &&
        userNumber < minUserNumber &&
        userNumber <= MAX_PAIR_USER - 1
      ) {
        minUserNumber = userNumber
        minUserNumberPairId = pairEntity.getAllProperties().pairId
      }
    })
    return minUserNumberPairId
  }

  async findMostFewMemberPairByTeamId(
    teamId: TeamId,
  ): Promise<PairEntity | undefined> {
    const pairEntitys = await this.pairRepository.findByTeamId(teamId)
    if (pairEntitys !== undefined) {
      let minUserCount = 0
      let userCount = 0
      let mostFewMemeberPair: PairEntity | undefined
      pairEntitys.forEach((pairEntity) => {
        if (pairEntity.getAllProperties().userIds?.length !== undefined) {
          userCount = pairEntity.getAllProperties().userIds!.length
          if (userCount < minUserCount || minUserCount === 0) {
            minUserCount = userCount
            mostFewMemeberPair = pairEntity
          }
        }
      })
      if (minUserCount === 0) {
        return undefined
      } else {
        return mostFewMemeberPair
      }
    } else {
      return undefined
    }
  }
  async autoPairCreate(): Promise<PairEntity> {
    let newPairName: PairName
    const newPairId = new PairId()
    for (let i = 0; i < 100; i++) {
      newPairName = PairName.getRandomPairName()
      let isRegisterd = await this.pairRepository.exists(newPairName)
      if (isRegisterd) {
        return new PairEntity(newPairId, newPairName)
      }
    }
    throw new DomainError('Failed to auto Pair create.')
  }
}
