import { Injectable } from '@nestjs/common'
import { prisma } from 'src/prisma'
import {
  TaskProgressEntity,
  TaskProgressId,
} from 'src/domain/task-progress/task-progress-entity'
import { ITaskProgressRepository } from 'src/domain/task-progress/task-progress-repository'
import { TaskId } from 'src/domain/task/task-entity'
import { UserId } from 'src/domain/user/user-entity'

@Injectable()
export class TaskProgressRepository implements ITaskProgressRepository {
  public async save(saveTaskProgressEntity: TaskProgressEntity): Promise<void> {
    const { taskProgressId, taskStatus, userId, taskId } =
      saveTaskProgressEntity.getAllProperties()
    await prisma.$transaction(async (tx) => {
      const result = await tx.taskProgress.findUnique({
        where: { taskProgressId: taskProgressId.value },
      })
      if (result === null) {
        await tx.taskProgress.create({
          data: {
            taskProgressId: taskProgressId.value,
            taskStatus: taskStatus,
            userId: userId.value,
            taskId: taskId.value,
          },
        })
      } else {
        await tx.taskProgress.update({
          where: { taskProgressId: taskProgressId.value },
          data: { taskStatus: taskStatus },
        })
      }
    })
  }

  public async findByTaskProgressId(
    taskProgressId: TaskProgressId,
  ): Promise<TaskProgressEntity | undefined> {
    const result = await prisma.taskProgress.findUnique({
      where: { taskProgressId: taskProgressId.value },
      include: { user: true, task: true },
    })
    if (result !== null) {
      return TaskProgressEntity.reconstruct({
        taskProgressId: result.taskProgressId,
        taskId: result.taskId,
        userId: result.userId,
        userName: result.user.userName,
        taskName: result.task.taskName,
        taskStatus: result.taskStatus,
      })
    } else {
      return undefined
    }
  }
  public async findByUserIdByTaskId(
    taskId: TaskId,
    userId: UserId,
  ): Promise<TaskProgressEntity | undefined> {
    const result = await prisma.taskProgress.findUnique({
      where: {
        task_progress_identifier: {
          userId: userId.value,
          taskId: taskId.value,
        },
      },
      include: { user: true, task: true },
    })
    if (result !== null) {
      return TaskProgressEntity.reconstruct({
        taskProgressId: result.taskProgressId,
        taskId: result.taskId,
        userId: result.userId,
        userName: result.user.userName,
        taskName: result.task.taskName,
        taskStatus: result.taskStatus,
      })
    } else {
      return undefined
    }
  }
}
