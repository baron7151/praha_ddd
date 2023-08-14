import { TaskEntity, TaskId } from '../task/task-entity'
import {
  TaskProgressEntity,
  TaskProgressId,
  TaskStatus,
} from '../task-progress/task-progress-entity'
import { UserId, UserName } from '../user/user-entity'

describe('TaskEntity', () => {
  const taskProgressId = new TaskProgressId()
  const taskId = new TaskId()
  const userId = new UserId()
  const userName = new UserName('test1')
  const taskName = 'DB1'
  const taskStatus = TaskStatus.NOT_STARTED
  it('constructor', () => {
    expect(
      () =>
        new TaskProgressEntity(
          taskProgressId,
          taskId,
          userId,
          userName,
          taskName,
          taskStatus,
        ),
    ).not.toThrow()
  })

  it('should return true when comparing two equal TaskProgressEntity instances', () => {
    const taskProgressEntity1 = new TaskProgressEntity(
      taskProgressId,
      taskId,
      userId,
      userName,
      taskName,
      taskStatus,
    )
    const taskProgressEntity2 = new TaskProgressEntity(
      taskProgressId,
      taskId,
      userId,
      userName,
      taskName,
      taskStatus,
    )

    const result = taskProgressEntity1.equals(taskProgressEntity2)

    expect(result).toBe(true)
  })
  it('getAllPropeties', () => {
    const taskProgressEntity = new TaskProgressEntity(
      taskProgressId,
      taskId,
      userId,
      userName,
      taskName,
      taskStatus,
    )
    expect(taskProgressEntity.getAllProperties()).toEqual({
      taskProgressId: taskProgressId,
      taskId: taskId,
      userId: userId,
      userName: userName,
      taskName: taskName,
      taskStatus: taskStatus,
    })
  })
  it('reconstruct', () => {
    const taskProgressId = new TaskProgressId().value
    const taskId = new TaskId().value
    const userId = new UserId().value
    const userName = 'test1'
    const taskName = 'DB1'
    const taskStatus = TaskStatus.COMPLETED
    const taskProgressEntity = TaskProgressEntity.reconstruct({
      taskProgressId,
      taskId,
      userId,
      userName,
      taskName,
      taskStatus,
    })
    expect(taskProgressEntity instanceof TaskProgressEntity).toBe(true)
  })
  it('changeTaskStatus', () => {
    const taskProgressEntity = new TaskProgressEntity(
      taskProgressId,
      taskId,
      userId,
      userName,
      taskName,
      taskStatus,
    )
    const updateTaskStatus = TaskStatus.COMPLETED
    const updateTaskStatusEntity =
      taskProgressEntity.changeTaskStatus(updateTaskStatus)
    expect(updateTaskStatusEntity.getAllProperties().taskStatus).toBe(
      updateTaskStatus,
    )
  })
})
