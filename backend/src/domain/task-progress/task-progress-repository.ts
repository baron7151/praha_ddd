import { TaskId } from '../task/task-entity'
import { UserId } from '../user/user-entity'
import { TaskProgressEntity, TaskProgressId } from './task-progress-entity'

export interface ITaskProgressRepository {
  findByTaskProgressId(
    taskProgressId: TaskProgressId,
  ): Promise<TaskProgressEntity | undefined>
  save(saveTaskProgressEntity: TaskProgressEntity): Promise<void>
  findByUserIdByTaskId(
    taskId: TaskId,
    userId: UserId,
  ): Promise<TaskProgressEntity | undefined>
}
