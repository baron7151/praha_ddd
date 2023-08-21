import { Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import { IPairRepository } from './pair-repository'
import { PairEntity, PairId, PairName } from './pair-entity'
import { ITeamRepository } from '../team/team-repository'
import { UserEntity, UserId, UserName } from '../user/user-entity'
import { IUserRepository } from '../user/user-repository'
import { TeamId } from '../team/team-entity'
import { DomainError } from '../common/domain-error'
import { UserService } from '../user/user-service'
import { User } from '@prisma/client'

export class PairService {
  constructor(
    @Inject(Providers.IPairRepository)
    private pairRepository: IPairRepository,
  ) {}
  //TODO ペアに所属するメンバー数に変更があり、ユーザの休会・退会に伴い複数名のメンバーの移動がある場合は仕様の見直しが必要になる。

  static findMovablePair(pairEntities: PairEntity[]): PairEntity | undefined {
    let minUserNumberPair: PairEntity | undefined = undefined
    for (const pairEntity of pairEntities) {
      const userCount = pairEntity.countPairMemer()
      if (
        pairEntity.isMoveablePair() &&
        (minUserNumberPair === undefined ||
          userCount < minUserNumberPair.countPairMemer())
      ) {
        minUserNumberPair = pairEntity
      }
    }
    return minUserNumberPair
  }

  async findMostFewMemberPairByTeamId(
    teamId: TeamId,
  ): Promise<PairEntity | undefined> {
    const pairEntities = await this.pairRepository.findByTeamId(teamId)

    if (!pairEntities) {
      return undefined
    }

    let mostFewMemberPair: PairEntity | undefined = undefined
    let minUserCount = Infinity

    for (const pairEntity of pairEntities) {
      if (pairEntity.isPairMemberExists()) {
        const userCount = pairEntity.countPairMemer()
        if (userCount < minUserCount) {
          minUserCount = userCount
          mostFewMemberPair = pairEntity
        }
      }
    }
    return mostFewMemberPair
  }
  async autoPairCreate(): Promise<PairEntity> {
    let newPairName: PairName
    const newPairId = new PairId()
    for (let i = 0; i < 100; i++) {
      newPairName = PairName.getRandomPairName()
      const isRegisterd = await this.pairRepository.exists(newPairName)
      if (!isRegisterd) {
        return new PairEntity(newPairId, newPairName)
      }
    }
    throw new DomainError('Failed to auto Pair create.')
  }
}
