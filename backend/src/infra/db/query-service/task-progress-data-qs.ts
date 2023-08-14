import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  ITaskProgressDataQS,
  TaskProgressDataDTO,
} from 'src/app/query-service-interface/task-progress-data-qs'
import { prisma } from 'src/prisma'

@Injectable()
export class TaskProgressDataQS implements ITaskProgressDataQS {
  public async getTaskProgress(
    limit?: number,
    offset?: number,
    taskCategory?: string,
    taskName?: string,
    taskStatus?: string,
  ): Promise<TaskProgressDataDTO[]> {
    const taskProgresses = await prisma.taskProgress.findMany({
      where: {
        taskStatus: taskStatus,
        task: {
          taskCategory: taskCategory,
          taskName: taskName,
        },
      },
      include: { user: true, task: true },
      skip: offset,
      take: limit,
    })
    return taskProgresses.map(
      (data) =>
        new TaskProgressDataDTO({
          taskProgressId: data.taskProgressId,
          taskId: data.taskId,
          userId: data.userId,
          taskStatus: data.taskStatus,
          taskCategory: data.task.taskCategory,
          taskName: data.task.taskName,
          userName: data.user.userName,
        }),
    )
  }
}
