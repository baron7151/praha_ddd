import { BaseUuid } from '../common/base-uuid'
import { DomainError } from '../common/domain-error'
import { PairId } from '../pair/pair-entity'
import { UserId } from '../user/user-entity'

export class TeamId extends BaseUuid {
  private type = 'TeamId'
}
export class TeamEntity {
  private teamId: TeamId
  private teamName: TeamName
  private pairIds?: PairId[]
  private userIds?: UserId[]
  constructor(
    teamId: TeamId,
    teamName: TeamName,
    pairIds?: PairId[],
    userIds?: UserId[],
  ) {
    this.teamId = teamId
    this.teamName = teamName
    this.pairIds = pairIds
    this.userIds = userIds
  }
  equals(other: TeamEntity): boolean {
    if (other == null || other == undefined) {
      return false
    }
    if (!(other instanceof TeamEntity)) {
      return false
    }
    return this.teamId.getId() === other.teamId.getId()
  }
  changeTeamName(teamName: TeamName): TeamEntity {
    return new TeamEntity(this.teamId, teamName, this.pairIds, this.userIds)
  }
  getAllProperties() {
    return {
      teamId: this.teamId,
      teamName: this.teamName,
      pairIds: this?.pairIds,
      userIds: this?.userIds,
    }
  }
  static checkTeamUserCount(userIds?: UserId[]): boolean {
    if (userIds === undefined) {
      return true
    } else if (userIds.length > 2) {
      return true
    } else {
      return false
    }
  }
}

export class TeamName {
  public readonly value: string

  constructor(value: string) {
    this.value = this.validate(value)
  }
  private validate(value: string) {
    const pattern = /^[0-9]+$/
    if (!pattern.test(value)) {
      throw new DomainError('Team Name must be numbers.')
    } else if (value.length > 3 || value.length < 1) {
      throw new DomainError(
        'Team names must be at least one and no more than three letters.',
      )
    }
    return value
  }
}
