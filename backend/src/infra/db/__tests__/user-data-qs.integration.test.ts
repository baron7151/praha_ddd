//import { SomeData } from 'src/domain/some-data/some-data'
//import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
//import { SomeDataRepository } from '../../repository/sample/some-data-repository'
import { UserDataQS } from '../query-service/user-data-qs'
import { UserDataDTO } from 'src/app/query-service-interface/user-data-qs'

describe('user-data-qs.integration.ts', () => {
  const userDataQS = new UserDataQS(prisma)
  beforeAll(async () => {
    await prisma.user.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
  describe('ユーザ検索ができる', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })
    it('getUsers', async () => {
      await prisma.user.create({
        data: {
          user_id: '1',
          name: 'test1',
          email: 'test1@example.com',
          status: '在籍中',
        },
      })

      const result1 = await userDataQS.getUsers('test1')
      expect(result1).toHaveLength(1)
      expect(result1[0]).toBeInstanceOf(UserDataDTO)
      expect(result1[0]?.userId).toEqual('1')
      expect(result1[0]?.name).toEqual('test1')
      expect(result1[0]?.email).toEqual('test1@example.com')
      expect(result1[0]?.status).toEqual('在籍中')

      await prisma.user.create({
        data: {
          user_id: '2',
          name: 'test1',
          email: 'test2@example.com',
          status: '在籍中',
        },
      })

      const result2 = await userDataQS.getUsers('test1')
      expect(result2).toHaveLength(2)
      expect(result2[1]).toBeInstanceOf(UserDataDTO)
      expect(result2[1]?.userId).toEqual('2')
      expect(result2[1]?.name).toEqual('test1')
      expect(result2[1]?.email).toEqual('test2@example.com')
      expect(result2[1]?.status).toEqual('在籍中')

      const result3 = await userDataQS.getAllUsers()
      expect(result3).toHaveLength(2)
      expect(result3[1]).toBeInstanceOf(UserDataDTO)
      expect(result3[1]?.userId).toEqual('2')
      expect(result3[1]?.name).toEqual('test1')
      expect(result3[1]?.email).toEqual('test2@example.com')
      expect(result3[1]?.status).toEqual('在籍中')
    })
  })
})
