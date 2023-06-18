import { Email } from '../common/email'
import { TeamEntity, TeamId, TeamName } from './team-entity'

export interface ITeamRepository {
  find(teamId: TeamId): TeamEntity
  save(team: TeamEntity): void
  exists(teamName: TeamName): boolean
}
