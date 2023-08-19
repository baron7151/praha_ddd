import { Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import { ITeamRepository } from './team-repository'
import { TeamEntity } from './team-entity'

export class TeamService {
  constructor(
    @Inject(Providers.ITeamRepository)
    private teamRepository: ITeamRepository,
  ) {}
  async findMostFewMemberTeam(): Promise<TeamEntity | undefined> {
    let minUserCount = 0
    let userCount = 0
    let mostFewMemeberTeam: TeamEntity | undefined
    const allTeamEntitys = await this.teamRepository.findAllTeams()
    if (allTeamEntitys !== undefined) {
      allTeamEntitys.forEach((teamEntity) => {
        userCount = teamEntity.countTeamUser()
        if (userCount < minUserCount || minUserCount === 0) {
          minUserCount = userCount
          mostFewMemeberTeam = teamEntity
        }
      })
      if (minUserCount === 0) {
        return undefined
      } else {
        return mostFewMemeberTeam
      }
    } else {
      return undefined
    }
  }
}
