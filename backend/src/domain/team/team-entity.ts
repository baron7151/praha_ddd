import { BaseUuid } from '../common/base-uuid'

export class TeamId extends BaseUuid {
  private type = 'TeamId'
}
export class TeamEntity {
  private teamName: TeamName
  private teamId: TeamId
  constructor(teamName: TeamName, teamId: TeamId) {
    this.teamName = teamName
    this.teamId = teamId
  }
  equal(other: TeamEntity): boolean {
    if (other == null || other == undefined) {
      return false
    }
    if (!(other instanceof TeamEntity)) {
      return false
    }
    return this.teamId.getId() === other.teamId.getId()
  }
  changeTeamName(teamName: TeamName): TeamEntity {
    return new TeamEntity(teamName, this.teamId)
  }
}

export class TeamName {
  private teamName: string

  constructor(teamName: string) {
    const pattern = /^[0-9]+$/
    if (!pattern.test(teamName)) {
      throw new Error('Team Name must be numbers.')
    } else if (teamName.length > 3 || teamName.length < 1) {
      throw new Error(
        'Team names must be at least one and no more than three letters.',
      )
    }
    this.teamName = teamName
  }
  changeTeamName(teamName: string): TeamName {
    const pattern = /^[0-9]+$/
    if (!pattern.test(teamName)) {
      throw new Error('Team Name must be numbers.')
    } else if (teamName.length > 3 || teamName.length < 1) {
      throw new Error(
        'Team names must be at least one and no more than three letters.',
      )
    }
    return new TeamName(teamName)
  }
  getTeamName(): string {
    return this.teamName
  }
}
