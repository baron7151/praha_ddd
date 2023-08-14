import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamId, TeamEntity, TeamName } from 'src/domain/team/team-entity'
import { ITeamRepository } from 'src/domain/team/team-repository'
import { Providers } from 'src/providers'
@Injectable()
export class PatchTeamDataUseCase {
  public constructor(
    @Inject(Providers.ITeamRepository)
    private readonly teamRepository: ITeamRepository,
  ) {}
  public async do(data: {
    teamId: string
    teamName?: string
    pairIds?: string[]
  }): Promise<void> {
    const { teamId, teamName, pairIds } = data

    const team = await this.teamRepository.findByTeamId(new TeamId(teamId))
    if (team !== undefined) {
      const updateTeam = new TeamEntity(
        new TeamId(teamId),
        teamName ? new TeamName(teamName) : team!.getAllProperties().teamName,
        pairIds
          ? pairIds?.map((pairId) => new PairId(pairId))
          : team!.getAllProperties().pairIds,
      )
      await this.teamRepository.save(updateTeam)
    } else {
      throw new Error('Not Found.')
    }
  }
}
