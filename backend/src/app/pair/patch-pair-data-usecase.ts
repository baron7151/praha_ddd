import { Injectable, Inject } from '@nestjs/common'
import { PairEntity, PairId, PairName } from 'src/domain/pair/pair-entity'
import { PairFactory } from 'src/domain/pair/pair-factory'
import { IPairRepository } from 'src/domain/pair/pair-repository'
import { TeamId } from 'src/domain/team/team-entity'
import { UserId } from 'src/domain/user/user-entity'
import { Providers } from 'src/providers'
@Injectable()
export class PatchPairDataUseCase {
  public constructor(
    @Inject(Providers.IPairRepository)
    private readonly pairRepository: IPairRepository,
    @Inject(PairFactory) private readonly pairFactory: PairFactory,
  ) {}
  public async do(data: {
    pairId: string
    pairName?: string
    teamId?: string
  }): Promise<void> {
    const { pairId, pairName, teamId } = data
    const pair = await this.pairRepository.findByPairId(new PairId(pairId))
    if (pair == null) {
      throw Error('更新するリソースがありません。')
    }
    const newPairEntity = await this.pairFactory.reconstruct({
      pairEntity: pair,
      newPairName: pairName,
      newTeamId: teamId,
    })
    await this.pairRepository.save(newPairEntity)
  }
}
