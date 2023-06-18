//import { SomeData } from 'src/domain/some-data/some-data'
//import { createRandomIdString } from 'src/util/random'
import { prisma } from 'src/prisma'
import axios, { isCancel, AxiosError } from 'axios'
import { UserStatus } from 'src/domain/user/user-entity'

describe('/user', () => {
  const user1 = {
    userId: '11111111-1111-1111-1111-111111111111',
    userName: 'test1',
    email: 'test1@example.com',
    status: UserStatus.ACTIVE,
  }
  const user2 = {
    userId: '22222222-2222-2222-2222-222222222222',
    userName: 'test2',
    email: 'test2@example.com',
    status: UserStatus.ACTIVE,
  }

  const user3 = {
    userId: '33333333-3333-3333-3333-333333333333',
    userName: 'test3',
    email: 'test3@example.com',
    status: UserStatus.ACTIVE,
  }

  beforeAll(async () => {
    await prisma.user.deleteMany({})
    await prisma.user.create({
      data: {
        ...user1,
      },
    })
    await prisma.user.create({
      data: {
        ...user2,
      },
    })
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
  describe('GET /user', () => {
    it('query stringsにnameあり', async () => {
      const url = 'http://localhost:3001/user?user_name=test1'
      const response = await axios.get(url)
      expect(response.status).toBe(200)
      expect(response.data.userData[0].userId).toBe(user1.userId)
    })
    it('query stringsなし', async () => {
      const url = 'http://localhost:3001/user'
      const response = await axios.get(url)
      expect(response.status).toBe(200)
      expect(response.data.userData.length).toBe(2)
      expect(response.data.userData[1].userId).toBe(user2.userId)
    })
  })
  describe('POST /users', () => {
    it('', async () => {
      const url = 'http://localhost:3001/user'
      const response = await axios.post(url, {
        user_name: user3.userName,
        email: user3.email,
      })
      expect(response.status).toBe(201)
      const result = await prisma.user.findUnique({
        where: { email: user3.email },
      })
      expect(result?.email).toBe(user3.email)
    })
  })

  describe('Patch /users', () => {
    it('', async () => {
      const updateUserName = 'xxxx'
      const updateEmail = 'xxxx@example.com'
      const updateStatus = UserStatus.INACTIVE
      const url = `http://localhost:3001/user`
      const response = await axios.patch(url, {
        user_id: user2.userId,
        user_name: updateUserName,
        email: updateEmail,
        status: updateStatus,
      })

      expect(response.status).toBe(200)
      const result = await prisma.user.findUnique({
        where: { email: updateEmail },
      })
      expect(result?.userName).toBe(updateUserName)
      expect(result?.email).toBe(updateEmail)
      expect(result?.status).toBe(updateStatus)
    })
  })
})
