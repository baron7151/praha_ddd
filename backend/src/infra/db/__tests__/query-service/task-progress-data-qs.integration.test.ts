import { prisma } from 'src/prisma'

import {
  cleaningAllTables,
  seedsTransfer,
  testUserData,
} from '@testUtil/initial_data/seed'
import { TaskProgressDataQS } from '../../query-service/task-progress-data-qs'

describe('user-data-qs.integration.ts', () => {
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {
    await cleaningAllTables()
    await prisma.$disconnect()
  })
  describe('TaskProgressDataQS', () => {
    it('getTaskProgress()', async () => {
      const taskProgressDataQS = new TaskProgressDataQS()
      const limit = 3
      const offset = 1
      const taskCategory = 'DB設計'
      const taskName = 'DBモデリング1'
      const taskStatus = 'COMPLETED'
      const result = await taskProgressDataQS.getTaskProgress(
        limit,
        offset,
        taskCategory,
        taskName,
        taskStatus,
      )

      expect(result.length).toBe(limit)
      result.map((d) => expect(d.taskCategory).toBe(taskCategory))
      result.map((d) => expect(d.taskStatus).toBe(taskStatus))
      result.map((d) => expect(d.taskName).toBe(taskName))
    })
  })
})
