import { ApiProperty } from '@nestjs/swagger'
import { TaskProgressDataDTO } from 'src/app/query-service-interface/task-progress-data-qs'

export class GetTaskProgressDataResponse {
  @ApiProperty({ type: () => [TaskProgressData] })
  taskProgressData: TaskProgressData[]

  public constructor(params: { taskProgressDatas: TaskProgressDataDTO[] }) {
    const { taskProgressDatas } = params
    this.taskProgressData = taskProgressDatas.map(
      ({
        taskProgressId,
        taskId,
        userId,
        userName,
        taskName,
        taskStatus,
        taskCategory,
      }) => {
        return new TaskProgressData({
          task_progress_id: taskProgressId,
          task_id: taskId,
          user_id: userId,
          user_name: userName,
          task_name: taskName,
          task_status: taskStatus,
          task_category: taskCategory,
        })
      },
    )
  }
}

export class TaskProgressData {
  @ApiProperty()
  task_progress_id: string

  @ApiProperty()
  task_id: string

  @ApiProperty()
  user_id: string

  @ApiProperty()
  user_name: string

  @ApiProperty()
  task_name: string

  @ApiProperty()
  task_status: string

  @ApiProperty()
  task_category: string

  public constructor(params: {
    task_progress_id: string
    task_id: string
    user_id: string
    user_name: string
    task_name: string
    task_status: string
    task_category: string
  }) {
    this.task_progress_id = params.task_progress_id
    this.task_id = params.task_id
    this.user_id = params.user_id
    this.user_name = params.user_name
    this.task_name = params.task_name
    this.task_status = params.task_status
    this.task_category = params.task_category
  }
}
