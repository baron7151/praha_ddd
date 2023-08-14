import { BaseUuid } from '../common/base-uuid'
import { TaskId } from '../task/task-entity'
import { UserId, UserName } from '../user/user-entity'

export class TaskProgressId extends BaseUuid {
  private type = 'TaskProgressId'
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  PROGRESS = 'PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class TaskProgressEntity {
  private taskProgressId: TaskProgressId
  private taskId: TaskId
  private userId: UserId
  private userName: UserName
  private taskName: string
  private taskStatus: TaskStatus
  constructor(
    taskProgressId: TaskProgressId,
    taskId: TaskId,
    userId: UserId,
    userName: UserName,
    taskName: string,
    taskStatus: TaskStatus,
  ) {
    this.taskProgressId = taskProgressId
    this.taskId = taskId
    this.userId = userId
    this.userName = userName
    this.taskName = taskName
    this.taskStatus = taskStatus
  }
  equals(other: TaskProgressEntity): boolean {
    if (other == null || other == undefined) {
      return false
    }
    if (!(other instanceof TaskProgressEntity)) {
      return false
    }
    return this.taskProgressId.getId() === other.taskProgressId.getId()
  }

  getAllProperties() {
    return {
      taskProgressId: this.taskProgressId,
      taskId: this.taskId,
      userId: this.userId,
      userName: this.userName,
      taskName: this.taskName,
      taskStatus: this.taskStatus,
    }
  }

  static reconstruct(data: {
    taskProgressId: string
    taskId: string
    userId: string
    userName: string
    taskName: string
    taskStatus: string
  }) {
    return new TaskProgressEntity(
      new TaskProgressId(data.taskProgressId),
      new TaskId(data.taskId),
      new UserId(data.userId),
      new UserName(data.userName),
      data.taskName,
      data.taskStatus as TaskStatus,
    )
  }
  changeTaskStatus(taskStatus: TaskStatus) {
    return new TaskProgressEntity(
      this.taskProgressId,
      this.taskId,
      this.userId,
      this.userName,
      this.taskName,
      taskStatus,
    )
  }
}
