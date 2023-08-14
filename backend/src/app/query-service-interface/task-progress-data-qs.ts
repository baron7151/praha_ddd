export class TaskProgressDataDTO {
  public readonly taskProgressId: string
  public readonly taskId: string
  public readonly userId: string
  public readonly userName: string
  public readonly taskName: string
  public readonly taskStatus: string
  public readonly taskCategory: string
  public constructor(props: {
    taskProgressId: string
    taskId: string
    userId: string
    userName: string
    taskName: string
    taskStatus: string
    taskCategory: string
  }) {
    const {
      taskProgressId,
      taskId,
      userId,
      userName,
      taskName,
      taskStatus,
      taskCategory,
    } = props
    this.taskProgressId = taskProgressId
    this.taskId = taskId
    this.userId = userId
    this.userName = userName
    this.taskName = taskName
    this.taskStatus = taskStatus
    this.taskCategory = taskCategory
  }
}

export interface ITaskProgressDataQS {
  getTaskProgress(
    limit?: number,
    offset?: number,
    taskCategory?: string,
    taskName?: string,
    taskStatus?: string,
  ): Promise<TaskProgressDataDTO[]>
}
