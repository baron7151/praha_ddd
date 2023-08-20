import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Patch,
  Inject,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import {
  GetPairDataResponse,
  PairData,
} from './response/get-pair-data-response'
import { GetPairDataUseCase } from 'src/app/pair/get-pair-data-usecase'
import { PatchPairDataRequest } from './request/patch-pair-data-request'
import { PatchPairDataUseCase } from 'src/app/pair/patch-pair-data-usecase'
@Controller({
  path: '/pair',
})
export class PairController {
  constructor(
    @Inject(GetPairDataUseCase)
    private readonly getPairDataUseCase: GetPairDataUseCase,
    @Inject(PatchPairDataUseCase)
    private readonly patchPairDataUseCase: PatchPairDataUseCase,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: GetPairDataResponse })
  async findAllPair() {
    const result = await this.getPairDataUseCase.do()
    const response = new GetPairDataResponse({ pairDataDTO: result })
    return response
  }
  @Patch()
  @ApiResponse({ status: 200 })
  async patchPairData(@Body() patchPairDataDto: PatchPairDataRequest) {
    await this.patchPairDataUseCase.do({
      pairId: patchPairDataDto.pair_id,
      pairName: patchPairDataDto.pair_name,
      teamId: patchPairDataDto.team_id,
    })
  }
}
