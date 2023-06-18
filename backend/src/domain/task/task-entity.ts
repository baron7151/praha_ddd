import { BaseUuid } from '../common/base-uuid'

export class TaskId extends BaseUuid {
  private type = 'TaskId'
}
export class TaskEntity {
  private taskName: string
  private taskId: TaskId
  private taskDetail: string
  constructor(taskName: string, taskId: TaskId, taskDetail: string) {
    this.taskName = taskName
    this.taskId = taskId
    this.taskDetail = taskDetail
  }
  equal(other: TaskEntity): boolean {
    if (other == null || other == undefined) {
      return false
    }
    if (!(other instanceof TaskEntity)) {
      return false
    }
    return this.taskId.getId() === other.taskId.getId()
  }
}
