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

describe('/user', () => {
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {
    await cleaningAllTables()
    await prisma.$disconnect()
  })
  describe('GET /user', () => {
    it('query stringsにnameあり', async () => {
      const url = `http://localhost:3001/user?user_name=${testUserData[0]?.userName}`
      const response = await axios.get(url)
      expect(response.status).toBe(200)
      expect(response.data.userData[0].user_id).toBe(testUserData[0]?.userId)
    })
    it('query stringsなし', async () => {
      const url = 'http://localhost:3001/user'
      const response = await axios.get(url)
      expect(response.status).toBe(200)
      expect(response.data.userData.length).toBe(testUserData.length)
      //expect(response.data.userData[0].userId).toBe(testUserData[0]?.userId)
    })
  })
  describe('POST /users', () => {
    it('', async () => {
      const userName = 'test10000'
      const email = 'test10000@example.com'
      const url = 'http://localhost:3001/user'
      const response = await axios.post(url, {
        user_name: userName,
        email: email,
      })
      expect(response.status).toBe(201)
      const result = await prisma.user.findUnique({
        where: { email: email },
      })
      expect(result?.email).toBe(email)
    })
  })

  describe('Patch /users', () => {
    it('', async () => {
      const updateUserName = 'xxxx'
      const updateEmail = 'xxxx@example.com'
      const updateStatus = UserStatus.ACTIVE
      const url = `http://localhost:3001/user`

      const response = await axios.patch(url, {
        user_id: testUserData[0]?.userId,
        user_name: updateUserName,
        email: updateEmail,
        status: updateStatus,
      })

      expect(response.status).toBe(200)
      const result = await axios.get(url + `?user_name=${updateUserName}`)
      expect(result.status).toBe(200)
      expect(result.data.userData[0].user_name).toBe(updateUserName)
      expect(result.data.userData[0].email).toBe(updateEmail)
      expect(result.data.userData[0].status).toBe(updateStatus)
    })
  })
})
