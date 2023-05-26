import { Id } from '../id'

enum TaskStatus {
  action = '未着手',
  ready = 'レビュー待ち',
  done = '完了',
}
export class TaskProgressEntity {
  private taskStatus: TaskStatus
  private taskProgressId: Id
  private taskId: Id
  private memberId: Id
  constructor(
    taskStatus: TaskStatus,
    taskId: Id,
    memberId: Id,
    taskProgressId: Id,
  ) {
    this.taskStatus = taskStatus
    this.taskId = taskId
    this.memberId = memberId
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
