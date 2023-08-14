import { BaseUuid } from '../common/base-uuid'

export class TaskId extends BaseUuid {
  private type = 'TaskId'
}
export class TaskEntity {
  private taskId: TaskId
  private taskName: string
  private taskContent: string
  private taskCategory: string
  constructor(
    taskId: TaskId,
    taskName: string,
    taskContent: string,
    taskCategory: string,
  ) {
    this.taskName = taskName
    this.taskId = taskId
    this.taskContent = taskContent
    this.taskCategory = taskCategory
  }
  equals(other: TaskEntity): boolean {
    if (other == null || other == undefined) {
      return false
    }
    if (!(other instanceof TaskEntity)) {
      return false
    }
    return this.taskId.getId() === other.taskId.getId()
  }

  getAllProperties() {
    return {
      taskId: this.taskId,
      taskName: this.taskName,
      taskContent: this.taskContent,
      taskCategory: this.taskCategory,
    }
  }
}
