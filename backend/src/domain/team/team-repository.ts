import { Email } from '../common/email'
import { TeamEntity, TeamId, TeamName } from './team-entity'

export interface ITeamRepository {
  findByTeamId(teamId: TeamId): Promise<TeamEntity | undefined>
  save(team: TeamEntity): Promise<void>
  exists(teamName: TeamName): Promise<boolean>
}
