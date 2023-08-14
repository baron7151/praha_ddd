import { PairEntity, PairId, PairName } from './pair-entity'

export interface IPairRepository {
  findByPairId(pairId: PairId): Promise<PairEntity | undefined>
  save(savePairData: PairEntity): Promise<void>
  exists(pairName: PairName): Promise<boolean>
}
