//import { SomeData } from 'src/domain/some-data/some-data'
//import { createRandomIdString } from 'src/util/random'
import { prisma } from 'src/prisma'
import axios, { isCancel, AxiosError } from 'axios'
import { UserStatus } from 'src/domain/user/user-entity'
import {
  cleaningAllTables,
  seedsTransfer,
  testPairData,
  testUserData,
} from '@testUtil/initial_data/seed'
import { UserData } from 'src/controller/response/get-user-data-response'

describe('/user', () => {
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {
    await cleaningAllTables()
    await prisma.$disconnect()
  })
  describe('GET /pair', () => {
    it('GET All Pairs', async () => {
      const url = `http://localhost:3001/pair`
      const response = await axios.get(url)
      expect(response.status).toBe(200)
      expect(response.data.pairDatas.length).toBe(testPairData.length)
    })
  })

  describe('Patch /pair', () => {
    it('', async () => {
      const updatePairName = 'X'
      const updatePairUsers = [testUserData[5]?.userId, testUserData[6]?.userId]
      const url = `http://localhost:3001/pair`

      const response = await axios.patch(url, {
        pair_id: testPairData[0]?.pairId,
        pair_name: updatePairName,
        user_ids: updatePairUsers,
      })

      expect(response.status).toBe(200)
      // const result = await prisma.user.findUnique({
      //   where: { userId: testUserData[0]?.userId },
      // })

      //expect(result?.userName).toBe(updateUserName)
      // expect(result?.email).toBe(updateEmail)
      // expect(result?.status).toBe(updateStatus)
    })
  })
})
