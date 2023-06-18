import { BaseUuid } from '../common/base-uuid'
import { TeamId } from '../team/team-entity'

export class PairId extends BaseUuid {
  private type = 'PairId'
}
export class PairEntity {
  private pairName: PairName
  private pairId: PairId
  private teamId: TeamId
  constructor(pairName: PairName, pairId: PairId, teamId: TeamId) {
    this.pairName = pairName
    this.pairId = pairId
    this.teamId = teamId
  }
  changePairName(pairName: PairName) {
    return new PairEntity(pairName, this.pairId, this.teamId)
  }
  equals(other: PairEntity): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof PairEntity)) {
      return false
    }
    return this.pairId.getId() === other.pairId.getId()
  }
  getId(): PairId {
    return this.pairId
  }
}

export class PairName {
  private pairName: string

  constructor(pairName: string) {
    const pattern = /^[a-zA-Z]+$/
    if (!pattern.test(pairName)) {
      throw new Error('Team Name must be alphabet.')
    } else if (pairName.length != 1) {
      throw new Error('Team names must be one letter.')
    }
    this.pairName = pairName
  }
  changePairName(pairName: string): PairName {
    const pattern = /^[a-zA-Z]+$/
    if (!pattern.test(pairName)) {
      throw new Error('Team Name must be alphabet.')
    } else if (pairName.length != 1) {
      throw new Error('Team names must be one letter.')
    }
    return new PairName(pairName)
  }
  getPairName(): string {
    return this.pairName
  }
}
