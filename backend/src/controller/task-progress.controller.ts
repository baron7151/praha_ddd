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
import { GetTaskProgressDataUseCase } from 'src/app/task-progress/get-task-progress-data-usecase'
import { GetTaskProgressDataResponse } from './response/get-task-progress-data-response'
import { PatchTaskProgressDataRequest } from './request/patch-task-progress-data-request'
import { PatchTaskProgressDataUseCase } from 'src/app/task-progress/patch-task-progress-data-usecase'

@Controller({
  path: '/taskprogress',
})
export class TaskProgressController {
  constructor(
    @Inject(GetTaskProgressDataUseCase)
    private readonly getTaskProgressDataUseCase: GetTaskProgressDataUseCase,
    @Inject(PatchTaskProgressDataUseCase)
    private readonly patchTaskProgressDataUseCase: PatchTaskProgressDataUseCase,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: GetTaskProgressDataResponse })
  async findTaskProgress(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('task_category') taskCategory?: string,
    @Query('task_name') taskName?: string,
    @Query('task_status') taskStatus?: string,
  ) {
    const convertedLimit = isNaN(limit) ? undefined : limit
    const convertedOffset = isNaN(offset) ? undefined : offset
    const result = await this.getTaskProgressDataUseCase.do(
      convertedLimit,
      convertedOffset,
      taskCategory,
      taskName,
      taskStatus,
    )
    const response = new GetTaskProgressDataResponse({
      taskProgressDatas: result,
    })
    return response
  }

  @Patch()
  @ApiResponse({ status: 200 })
  async patchTaskProgressData(
    @Body() patchTaskProgressDataDto: PatchTaskProgressDataRequest,
  ) {
    await this.patchTaskProgressDataUseCase.do(
      patchTaskProgressDataDto.task_progress_id,
      patchTaskProgressDataDto.task_status,
    )
  }
}
