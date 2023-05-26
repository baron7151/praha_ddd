import { Email } from '../email'
import { Id } from '../id'
import { TeamEntity, TeamName } from './team-entity'

export interface ITeamRepository {
  find(teamId: Id): TeamEntity
  save(team: TeamEntity): void
  exists(teamName: TeamName): boolean
}
