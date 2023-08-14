import {
  cleaningAllTables,
  seedsTransfer,
  testPairData,
  testTaskData,
  testTaskProgressData,
  testTeamData,
  testUserData,
} from '@testUtil/initial_data/seed'
import { TeamId, TeamName, TeamEntity } from 'src/domain/team/team-entity'
import { UserId, UserName } from 'src/domain/user/user-entity'
import { prisma } from 'src/prisma'
import { TeamRepository } from '../../repository/team-repository'
import { PairId } from 'src/domain/pair/pair-entity'
import { TaskProgressRepository } from '../../repository/task-progress-repository'
import {
  TaskProgressEntity,
  TaskProgressId,
  TaskStatus,
} from 'src/domain/task-progress/task-progress-entity'
import { TaskId } from 'src/domain/task/task-entity'
import { uuid } from 'uuidv4'

// テストコード
describe('TaskProgressRepository', () => {
  let taskProgressRepository: TaskProgressRepository
  beforeAll(async () => {
    taskProgressRepository = new TaskProgressRepository()
    await cleaningAllTables()
    await seedsTransfer()
  })

  beforeEach(() => {})

  afterAll(async () => {
    cleaningAllTables()
    await prisma.$disconnect()
  })

  test('test findByTaskProgressId()', async () => {
    // findメソッドを実行
    const taskProgressId = new TaskProgressId(
      testTaskProgressData[0]?.taskProgressId,
    )
    const result = await taskProgressRepository.findByTaskProgressId(
      taskProgressId,
    )
    const resultAllProperties = result?.getAllProperties()
    expect(resultAllProperties?.taskProgressId.value).toBe(taskProgressId.value)
  })
  test('test findByUserIdByTaskId()', async () => {
    // findメソッドを実行
    const taskId = new TaskId(testTaskProgressData[0]?.task.connect?.taskId)
    const userId = new UserId(testTaskProgressData[0]?.user.connect?.userId)
    const result = await taskProgressRepository.findByUserIdByTaskId(
      taskId,
      userId,
    )
    const resultAllProperties = result?.getAllProperties()
    expect(resultAllProperties?.taskId.value).toBe(taskId.value)
    expect(resultAllProperties?.userId.value).toBe(userId.value)
  })

  describe('test save()', () => {
    it('should save the team data(create)', async () => {
      const taskProgressId = new TaskProgressId()
      const taskStatus = TaskStatus.NOT_STARTED
      const taskId = new TaskId(testTaskData[4]!.taskId)
      const userId = new UserId(testUserData[6]!.userId)
      const userName = new UserName(testUserData[6]!.userName)
      const taskName = testTaskData[4]!.taskName
      const taskProgress = new TaskProgressEntity(
        taskProgressId,
        taskId,
        userId,
        userName,
        taskName,
        taskStatus,
      )
      await taskProgressRepository.save(taskProgress)
      const result = await taskProgressRepository.findByTaskProgressId(
        taskProgressId,
      )
      expect(result?.getAllProperties()).toEqual({
        taskProgressId: taskProgressId,
        taskId: taskId,
        userId: userId,
        userName: userName,
        taskName: taskName,
        taskStatus: taskStatus,
      })
    })
    it('should save the team data(update)', async () => {
      const updateTaskStatus = TaskStatus.PROGRESS
      const taskProgressId = new TaskProgressId(
        testTaskProgressData[0]?.taskProgressId,
      )
      const taskProgress = await taskProgressRepository.findByTaskProgressId(
        taskProgressId,
      )
      const changeTaskProgressStatus = taskProgress!.changeTaskStatus(
        TaskStatus.PROGRESS,
      )
      await taskProgressRepository.save(changeTaskProgressStatus)
      const result = await taskProgressRepository.findByTaskProgressId(
        taskProgressId,
      )

      expect(result?.getAllProperties().taskStatus).toBe(updateTaskStatus)
    })
  })
})
