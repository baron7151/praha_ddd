//import { SomeData } from 'src/domain/some-data/some-data'
//import { createRandomIdString } from 'src/util/random'
import { prisma } from 'src/prisma'
import axios, { isCancel, AxiosError } from 'axios'
import { UserStatus } from 'src/domain/user/user-entity'
import {
  cleaningAllTables,
  seedsTransfer,
  testPairData,
  testTaskProgressData,
  testUserData,
} from '@testUtil/initial_data/seed'

describe('/user', () => {
  const url = `http://localhost:3001/taskprogress`
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {
    await cleaningAllTables()
    await prisma.$disconnect()
  })
  describe('GET /taskprogress', () => {
    it('query stringsにnameあり', async () => {
      const response = await axios.get(
        url +
          `?limit=2&task_category=DB設計&task_name=DBモデリング1&task_status=COMPLETED`,
      )
      expect(response.status).toBe(200)
      expect(response.data.taskProgressData.length).toBe(2)
      expect(response.data.taskProgressData[0].task_name).toBe('DBモデリング1')
      expect(response.data.taskProgressData[0].task_category).toBe('DB設計')
      expect(response.data.taskProgressData[0].task_status).toBe('COMPLETED')
    })
  })

  describe('Patch /taskprogress', () => {
    it('', async () => {
      const taskProgressId = testTaskProgressData[0]?.taskProgressId
      const updateStatus = 'NOT_STARTED'
      const response = await axios.patch(url, {
        task_progress_id: taskProgressId,
        task_status: updateStatus,
      })
      expect(response.status).toBe(200)
    })
  })
})
