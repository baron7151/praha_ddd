import { prisma } from 'src/prisma'
import { UserDataQS } from '../../query-service/user-data-qs'
import { UserDataDTO } from 'src/app/query-service-interface/user-data-qs'
import {
  cleaningAllTables,
  seedsTransfer,
  testUserData,
} from '@testUtil/initial_data/seed'

describe('user-data-qs.integration.ts', () => {
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {
    await cleaningAllTables()
    await prisma.$disconnect()
  })
  describe('ユーザ検索ができる', () => {
    it('getUsers', async () => {
      const userDataQS = new UserDataQS()
      const result1 = await userDataQS.getUsers(testUserData[0]!.userName)
      expect(result1).toHaveLength(1)
      expect(result1[0]).toBeInstanceOf(UserDataDTO)
      expect(result1[0]?.userId).toEqual(testUserData[0]!.userId)
      expect(result1[0]?.userName).toEqual(testUserData[0]!.userName)
      expect(result1[0]?.email).toEqual(testUserData[0]!.email)
      expect(result1[0]?.status).toEqual(testUserData[0]!.status)
      const result2 = await userDataQS.getAllUsers()
      expect(result2).toHaveLength(testUserData.length)
    })
  })
})
