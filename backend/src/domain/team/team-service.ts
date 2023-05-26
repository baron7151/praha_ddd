import { Id } from 'src/domain/id'
import { TeamEntity, TeamName } from './team-entity'
import { ITeamRepository } from './team-repository'

export class MemberService {
  private teamRepository: ITeamRepository
  constructor(teamReposigory: ITeamRepository) {
    this.teamRepository = teamReposigory
  }
  public exists(teamName: TeamName): boolean {
    const result: boolean = this.teamRepository.exists(teamName)
    return result
  }
}
