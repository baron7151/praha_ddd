import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamId, TeamEntity, TeamName } from 'src/domain/team/team-entity'
import { TeamFactory } from 'src/domain/team/team-factory'
import { ITeamRepository } from 'src/domain/team/team-repository'
import { Providers } from 'src/providers'
@Injectable()
export class PatchTeamDataUseCase {
  public constructor(
    @Inject(Providers.ITeamRepository)
    private readonly teamRepository: ITeamRepository,
    @Inject(TeamFactory) private readonly teamFactory: TeamFactory,
  ) {}
  public async do(data: { teamId: string; teamName?: string }): Promise<void> {
    const { teamId, teamName } = data
    const team = await this.teamRepository.findByTeamId(new TeamId(teamId))
    if (team !== undefined) {
      const updateTeam = await this.teamFactory.reconstruct({
        teamEntity: team,
        newTeamName: teamName,
      })
      await this.teamRepository.save(updateTeam)
    } else {
      throw new Error('Not Found.')
    }
  }
}
