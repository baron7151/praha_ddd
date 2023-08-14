import { Body, Controller, Get, Patch, Inject } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetPairDataResponse } from './response/get-pair-data-response'
import { GetTeamDataUseCase } from 'src/app/team/get-team-data-usecase'
import { GetTeamDataResponse } from './response/get-team-data-response'
import { PatchTeamDataUseCase } from 'src/app/team/patch-team-data-usecase'
import { PatchTeamDataRequest } from './request/patch-team-data-request'
@Controller({
  path: '/team',
})
export class TeamController {
  constructor(
    @Inject(GetTeamDataUseCase)
    private readonly getTeamDataUseCase: GetTeamDataUseCase,
    @Inject(PatchTeamDataUseCase)
    private readonly patchTeamDataUseCase: PatchTeamDataUseCase,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: GetTeamDataResponse })
  async findAllTeam() {
    const result = await this.getTeamDataUseCase.do()
    const response = new GetTeamDataResponse({ teamDataDTO: result })
    return response
  }
  @Patch()
  @ApiResponse({ status: 200 })
  async patchPairData(@Body() patchTeamDataDto: PatchTeamDataRequest) {
    await this.patchTeamDataUseCase.do({
      teamId: patchTeamDataDto.team_id,
      teamName: patchTeamDataDto.team_name,
      pairIds: patchTeamDataDto.pair_ids,
    })
  }
}
