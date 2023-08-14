import { Injectable, Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import {
  ITeamDataQS,
  TeamDataDTO,
} from '../query-service-interface/team-data-qs'
@Injectable()
export class GetTeamDataUseCase {
  public constructor(
    @Inject(Providers.ITeamDataQS) private readonly teamDataQS: ITeamDataQS,
  ) {}
  public async do(): Promise<TeamDataDTO[]> {
    return await this.teamDataQS.getAllTeams()
  }
}
