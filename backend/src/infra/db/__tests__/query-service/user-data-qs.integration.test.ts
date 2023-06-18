import { prisma } from 'src/prisma'
import { UserDataQS } from '../../query-service/user-data-qs'
import { UserDataDTO } from 'src/domain/user/user-dto'

describe('user-data-qs.integration.ts', () => {
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
          userId: '1',
          userName: 'test1',
          email: 'test1@example.com',
          status: 'active',
        },
      })
      const userDataQS = new UserDataQS()
      const result1 = await userDataQS.getUsers('test1')
      expect(result1).toHaveLength(1)
      expect(result1[0]).toBeInstanceOf(UserDataDTO)
      expect(result1[0]?.userId).toEqual('1')
      expect(result1[0]?.userName).toEqual('test1')
      expect(result1[0]?.email).toEqual('test1@example.com')
      expect(result1[0]?.status).toEqual('active')

      await prisma.user.create({
        data: {
          userId: '2',
          userName: 'test1',
          email: 'test2@example.com',
          status: 'active',
        },
      })

      const result2 = await userDataQS.getUsers('test1')
      expect(result2).toHaveLength(2)
      expect(result2[1]).toBeInstanceOf(UserDataDTO)
      expect(result2[1]?.userId).toEqual('2')
      expect(result2[1]?.userName).toEqual('test1')
      expect(result2[1]?.email).toEqual('test2@example.com')
      expect(result2[1]?.status).toEqual('active')

      const result3 = await userDataQS.getAllUsers()
      expect(result3).toHaveLength(2)
      expect(result3[1]).toBeInstanceOf(UserDataDTO)
      expect(result3[1]?.userId).toEqual('2')
      expect(result3[1]?.userName).toEqual('test1')
      expect(result3[1]?.email).toEqual('test2@example.com')
      expect(result3[1]?.status).toEqual('active')
    })
  })
})
