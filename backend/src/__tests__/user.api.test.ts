//import { SomeData } from 'src/domain/some-data/some-data'
//import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import axios, { isCancel, AxiosError } from 'axios'
//import { SomeDataRepository } from '../../repository/sample/some-data-repository'
import { UserDataDTO } from 'src/app/query-service-interface/user-data-qs'
import { UserDataQS } from 'src/infra/db/query-service/user-data-qs'

describe('/user', () => {
  const userDataQS = new UserDataQS(prisma)
  beforeAll(async () => {
    await prisma.user.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
  describe('GET /users', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })
    it('API呼び出しに成功する。', async () => {
      //テストデータ投入
      await prisma.user.create({
        data: {
          user_id: '1',
          name: 'test1',
          email: 'test1@example.com',
          status: '在籍中',
        },
      })
      const name = 'test1'
      const url = 'http://localhost:3001/user?name=test1'
      const response = await axios.get(url)
      console.log(response.status)
      console.log(response.data)
    })
  })
})
