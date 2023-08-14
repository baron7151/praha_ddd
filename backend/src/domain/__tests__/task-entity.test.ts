import { TaskEntity, TaskId } from '../task/task-entity'

describe('TaskEntity', () => {
  const taskId = new TaskId()
  const taskName = 'DB Modeling1'
  const taskContent = 'hogehoge'
  const taskCategory = 'DB Modeling'
  it('constructor', () => {
    expect(
      () => new TaskEntity(taskId, taskName, taskContent, taskCategory),
    ).not.toThrow()
  })

  it('should return true when comparing two equal TeamEntity instances', () => {
    const taskEntity1 = new TaskEntity(
      taskId,
      taskName,
      taskContent,
      taskCategory,
    )
    const taskEntity2 = new TaskEntity(
      taskId,
      taskName,
      taskContent,
      taskCategory,
    )

    const result = taskEntity1.equals(taskEntity2)

    expect(result).toBe(true)
  })
  it('getAllPropeties', () => {
    const taskEntity = new TaskEntity(
      taskId,
      taskName,
      taskContent,
      taskCategory,
    )
    expect(taskEntity.getAllProperties()).toEqual({
      taskId: taskId,
      taskName: taskName,
      taskContent: taskContent,
      taskCategory: taskCategory,
    })
  })
})
