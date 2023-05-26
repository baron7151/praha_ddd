import { Id } from '../id'
export class PairEntity {
  private pairName: PairName
  private pairId: string
  private teamId: string
  constructor(pairName: PairName, pairId: string, teamId: string) {
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
    return this.pairId === other.pairId
  }
  getId(): string {
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
