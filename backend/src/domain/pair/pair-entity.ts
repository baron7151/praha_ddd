import { Pair } from '@prisma/client'
import { BaseUuid } from '../common/base-uuid'
import { TeamId } from '../team/team-entity'
import { UserId } from '../user/user-entity'
import { DomainError } from '../common/domain-error'

export const MIN_PAIR_USER = 2
export const MAX_PAIR_USER = 3
export const PAIR_NAME_WORD_COUNT = 1

export class PairId extends BaseUuid {
  private type = 'PairId'
}
export class PairEntity {
  private pairId: PairId
  private pairName: PairName
  private readonly teamId?: TeamId
  private readonly userIds?: UserId[]
  constructor(
    pairId: PairId,
    pairName: PairName,
    teamId?: TeamId,
    userIds?: UserId[],
  ) {
    if (PairEntity.checkPairUserCount(userIds)) {
      this.userIds = userIds
      this.pairId = pairId
      this.teamId = teamId
      this.pairName = pairName
    } else {
      throw new DomainError(
        `The number of users that can be registered in a pair is between 2 and 3. result ${userIds?.length}`,
      )
    }
  }
  changePairName(pairName: PairName) {
    return new PairEntity(this.pairId, pairName, this.teamId, this.userIds)
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
  getAllProperties() {
    return {
      pairId: this.pairId,
      pairName: this.pairName,
      teamId: this.teamId,
      userIds: this?.userIds,
    }
  }
  static checkPairUserCount(userIds?: UserId[]): boolean {
    if (userIds === undefined) {
      return true
    } else if (
      userIds.length < MIN_PAIR_USER ||
      userIds.length > MAX_PAIR_USER
    ) {
      return false
    } else {
      return true
    }
  }
  getId(): PairId {
    return this.pairId
  }
  changeTeam(teamId: TeamId) {
    return new PairEntity(this.pairId, this.pairName, teamId, this.userIds)
  }
  isMinimumMember(): boolean {
    if (
      this.userIds?.length !== undefined &&
      this.userIds!.length <= MIN_PAIR_USER
    ) {
      return true
    } else {
      return false
    }
  }
  isMaximumMember(): boolean {
    if (
      this.userIds?.length !== undefined &&
      this.userIds.length >= MAX_PAIR_USER
    ) {
      return true
    } else {
      return false
    }
  }
  isMoveablePair(): boolean {
    if (this.userIds !== undefined && this.userIds!.length < MAX_PAIR_USER) {
      return true
    } else {
      return false
    }
  }
  isPairMemberExists(): boolean {
    return this.userIds !== undefined ? true : false
  }
  countPairMemer(): number {
    if (this.userIds !== undefined) {
      return this.userIds.length
    } else {
      return 0
    }
  }
  selectUserAtRandom(): UserId | undefined {
    if (this.userIds !== undefined) {
      const randomIndex = Math.floor(Math.random() * this.userIds.length)
      return this.userIds[randomIndex] as UserId
    } else {
      return undefined
    }
  }
  isBelongingToTeam(): boolean {
    if (this.teamId !== undefined) {
      return true
    } else {
      return false
    }
  }
}

export class PairName {
  public readonly value: string

  constructor(value: string) {
    this.value = this.validate(value)
  }
  private validate(value: string) {
    const pattern = /^[a-zA-Z]+$/
    if (!pattern.test(value)) {
      throw new Error('Pair Name must be alphabet.')
    } else if (value.length != PAIR_NAME_WORD_COUNT) {
      throw new Error('Pair names must be one letter.')
    }
    return value
  }
  public static getRandomPairName(): PairName {
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    const randomIndex = Math.floor(Math.random() * characters.length)
    const randomCharacter = characters[randomIndex]

    // Randomly decide whether to return upper or lower case
    const isUpperCase = Math.random() < 0.5
    if (randomCharacter !== undefined) {
      return isUpperCase
        ? new PairName(randomCharacter.toUpperCase())
        : new PairName(randomCharacter)
    } else {
      throw new DomainError('Failed to generate random pairName.')
    }
  }
}
