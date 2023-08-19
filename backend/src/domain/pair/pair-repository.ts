import { Pair } from '@prisma/client'
import { TeamId } from '../team/team-entity'
import { PairEntity, PairId, PairName } from './pair-entity'

export interface IPairRepository {
  findByPairId(pairId: PairId): Promise<PairEntity | undefined>
  findByTeamId(teamId: TeamId): Promise<PairEntity[] | undefined>
  save(savePairData: PairEntity): Promise<void>
  exists(pairName: PairName): Promise<boolean>
  findByTeamId(teamId: TeamId): Promise<PairEntity[] | undefined>
}
