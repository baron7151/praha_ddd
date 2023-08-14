import { Injectable, Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import { ITaskProgressRepository } from 'src/domain/task-progress/task-progress-repository'
import {
  TaskProgressId,
  TaskStatus,
} from 'src/domain/task-progress/task-progress-entity'
@Injectable()
export class PatchTaskProgressDataUseCase {
  public constructor(
    @Inject(Providers.ITaskProgressRepository)
    private readonly taskProgressRepository: ITaskProgressRepository,
  ) {}
  public async do(taskProgressId: string, taskStatus: string): Promise<void> {
    const taskProgressEntity =
      await this.taskProgressRepository.findByTaskProgressId(
        new TaskProgressId(taskProgressId),
      )
    if (taskProgressEntity !== undefined) {
      const changeTaskStatus = taskProgressEntity.changeTaskStatus(
        taskStatus as TaskStatus,
      )
      await this.taskProgressRepository.save(changeTaskStatus)
    } else {
      throw new Error('Not Found.')
    }
  }
}
