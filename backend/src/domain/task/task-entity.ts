import { Id } from '../id'
export class TaskEntity {
  private taskName: string
  private taskId: Id
  private task: string
  constructor(taskName: string, taskId: Id, task: string) {
    this.taskName = taskName
    this.taskId = taskId
    this.task = task
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
