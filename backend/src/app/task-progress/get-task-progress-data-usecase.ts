import { Injectable, Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import {
  ITaskProgressDataQS,
  TaskProgressDataDTO,
} from '../query-service-interface/task-progress-data-qs'
@Injectable()
export class GetTaskProgressDataUseCase {
  public constructor(
    @Inject(Providers.ITaskProgressDataQS)
    private readonly taskProgressDataQS: ITaskProgressDataQS,
  ) {}
  public async do(
    limit?: number,
    offset?: number,
    taskCategory?: string,
    taskName?: string,
    taskStatus?: string,
  ): Promise<TaskProgressDataDTO[]> {
    return await this.taskProgressDataQS.getTaskProgress(
      limit,
      offset,
      taskCategory,
      taskName,
      taskStatus,
    )
  }
}
