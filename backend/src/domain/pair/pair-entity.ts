import { Pair } from '@prisma/client'
import { BaseUuid } from '../common/base-uuid'
import { TeamId } from '../team/team-entity'
import { UserId } from '../user/user-entity'
import { DomainError } from '../common/domain-error'

export class PairId extends BaseUuid {
  private type = 'PairId'
}
export class PairEntity {
  private pairId: PairId
  private pairName: PairName
  private teamId?: TeamId
  private userIds?: UserId[]
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
    } else if (userIds.length < 2 || userIds.length > 3) {
      return false
    } else {
      return true
    }
  }
  removePairUser(userId: UserId): PairEntity {
    if (this.userIds === undefined) {
      return new PairEntity(this.pairId, this.pairName)
    } else {
      const userIds = this.userIds.filter(
        (removeElement) => removeElement !== userId,
      )
      return new PairEntity(this.pairId, this.pairName, this?.teamId, userIds)
    }
  }
  addPairUser(userId: UserId): PairEntity {
    if (this.userIds === undefined) {
      return new PairEntity(this.pairId, this.pairName, this?.teamId, [userId])
    } else {
      const userIds = [...this.userIds, userId]
      return new PairEntity(this.pairId, this.pairName, this?.teamId, userIds)
    }
  }
  getId(): PairId {
    return this.pairId
  }
  static create(props: {
    pairId: string
    pairName: string
    teamId?: string | null
    userIds?: string[] | null
  }): PairEntity {
    const { pairId, pairName, teamId, userIds } = props
    return new PairEntity(
      new PairId(pairId),
      new PairName(pairName),
      teamId != null ? new TeamId(teamId) : undefined,
      userIds != null ? userIds.map((userId) => new UserId(userId)) : undefined,
    )
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
    } else if (value.length != 1) {
      throw new Error('Pair names must be one letter.')
    }
    return value
  }
}
