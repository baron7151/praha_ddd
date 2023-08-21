import { Injectable, Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import { DomainError } from '../common/domain-error'
import { TeamEntity, TeamId, TeamName } from './team-entity'
import { UserId } from '../user/user-entity'

import { ITeamRepository } from './team-repository'
import { PairEntity, PairId, PairName } from '../pair/pair-entity'

@Injectable()
export class TeamFactory {
  constructor(
    @Inject(Providers.ITeamRepository)
    private teamRepository: ITeamRepository,
  ) {}
  static create(props: {
    teamId: string
    teamName: string
    pairIds?: string[]
    userIds?: string[]
  }): TeamEntity {
    const { teamId, teamName, pairIds, userIds } = props
    const mappedPairIds =
      pairIds != null && pairIds.length > 0
        ? pairIds.map((pairId) => new PairId(pairId))
        : undefined

    const mappedUserIds =
      userIds != null && userIds.length > 0
        ? userIds.map((userId) => new UserId(userId))
        : undefined

    return new TeamEntity(
      new TeamId(teamId),
      new TeamName(teamName),
      mappedPairIds,
      mappedUserIds,
    )
  }

  public async reconstruct(props: {
    teamEntity: TeamEntity
    newTeamName?: string
  }): Promise<TeamEntity> {
    const { teamEntity, newTeamName } = props
    const { teamId, teamName, pairIds, userIds } = teamEntity.getAllProperties()
    if (newTeamName) {
      const duplicateTeamNameCheck = await this.teamRepository.exists(
        new TeamName(newTeamName),
      )
      if (duplicateTeamNameCheck) {
        throw new DomainError(
          `This TeamName is already registered. ${newTeamName}`,
        )
      }
    }
    return new TeamEntity(
      teamId,
      newTeamName === undefined ? teamName : new TeamName(newTeamName),
      pairIds,
      userIds,
    )
  }
}
