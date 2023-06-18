import { BaseUuid } from '../common/base-uuid'
import { UserId } from '../user/user-entity'
import { TaskId } from './task-entity'

enum TaskStatus {
  action = '未着手',
  ready = 'レビュー待ち',
  done = '完了',
}

export class TaskProgressId extends BaseUuid {
  private type = 'TaskProgressId'
}
export class TaskProgressEntity {
  private taskStatus: TaskStatus
  private taskProgressId: TaskProgressId
  private taskId: TaskId
  private userId: UserId
  constructor(
    taskStatus: TaskStatus,
    taskId: TaskId,
    userId: UserId,
    taskProgressId: TaskProgressId,
  ) {
    this.taskStatus = taskStatus
    this.taskId = taskId
    this.userId = userId
    this.taskProgressId = taskProgressId
  }
  equal(other: TaskProgressEntity): boolean {
    if (other == null || other == undefined) {
      return false
    }
    if (!(other instanceof TaskProgressEntity)) {
      return false
    }
    return this.taskProgressId.getId == other.taskProgressId.getId
  }
}
