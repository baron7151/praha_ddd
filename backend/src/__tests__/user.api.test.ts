//import { SomeData } from 'src/domain/some-data/some-data'
//import { createRandomIdString } from 'src/util/random'
import { prisma } from 'src/prisma'
import axios, { isCancel, AxiosError } from 'axios'
import {
  UserEntity,
  UserId,
  UserName,
  UserStatus,
} from 'src/domain/user/user-entity'
import {
  cleaningAllTables,
  seedsTransfer,
  testPairData,
  testUserData,
} from '@testUtil/initial_data/seed'
import e from 'express'
import { resourceUsage } from 'process'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamId } from 'src/domain/team/team-entity'
import { Email } from 'src/domain/common/email'
import { Prisma } from '@prisma/client'
import { uuid } from 'uuidv4'

describe('/user', () => {
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {})
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
  describe('ユースケース', () => {
    it('参加者が減ることでチームのメンバーが２名以下になる場合は、メール送信（ログ）が出力される。', async () => {
      await cleaningAllTables()
      await seedsTransfer()
      const url = `http://localhost:3001/user`
      console.log(
        '参加者が減ることでチームのメンバーが２名以下になる場合は、メール送信（ログ）が出力される。',
      )
      const updateUserId = testUserData[0]!.userId
      const updateStatus = UserStatus.INACTIVE
      const response = await axios.patch(url, {
        user_id: updateUserId,
        status: updateStatus,
      })
      expect(response.status).toBe(200)
    })
    it('休会・退会に伴い参加者が減ることでペアのメンバーが1名になる場合は、残ったメンバーは他のペアに合流する。', async () => {
      await cleaningAllTables()
      await seedsTransfer()
      const url = `http://localhost:3001/user`
      const response = await axios.patch(url, {
        user_id: testUserData[0]?.userId,
        status: UserStatus.INACTIVE,
      })
      expect(response.status).toBe(200)
      const result = await prisma.user.findMany({
        where: { pairId: testPairData[0]?.pairId },
      })
      expect(result.length).toBe(0)
    })
    it('休会・退会に伴い参加者が減ることでチームのメンバーが２名以下になった場合は、メール送信（ログ）出力される。', async () => {
      const url = `http://localhost:3001/user`
      console.log(
        '休会・退会に伴い参加者が減ることでチームのメンバーが２名以下になった場合は、メール送信（ログ）出力される。',
      )
      const response = await axios.patch(url, {
        user_id: testUserData[1]?.userId,
        status: UserStatus.INACTIVE,
      })
      expect(response.status).toBe(200)
    })
    it('休会・退会に伴い参加者が減ることでペアのメンバーが1名になり、合流可能なペアがない場合は、メール送信（ログ）出力される。', async () => {
      await cleaningAllTables()
      const testTeamData: Prisma.TeamCreateInput[] = ([] = [
        {
          teamId: uuid(),
          teamName: '1',
        },
      ])
      const testPairData: Prisma.PairCreateInput[] = [
        {
          pairId: uuid(),
          pairName: 'A',
          team: {
            connect: { teamId: testTeamData[0]!.teamId },
          },
        },
        {
          pairId: uuid(),
          pairName: 'B',
          team: {
            connect: { teamId: testTeamData[0]!.teamId },
          },
        },
      ]
      const testUserData: Prisma.UserCreateInput[] = [
        {
          userId: uuid(),
          userName: 'test1',
          email: 'test1@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[0]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test2',
          email: 'test2@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[0]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test3',
          email: 'test3@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[1]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test4',
          email: 'test4@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[1]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test5',
          email: 'test5@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[1]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
      ]
      await prisma.$transaction(
        testTeamData.map((d) => prisma.team.create({ data: d })),
      )
      await prisma.$transaction(
        testPairData.map((d) => prisma.pair.create({ data: d })),
      )
      await prisma.$transaction(
        testUserData.map((d) => prisma.user.create({ data: d })),
      )
      const url = `http://localhost:3001/user`
      console.log(
        '休会・退会に伴い参加者が減ることでペアのメンバーが1名になり、合流可能なペアがない場合は、メール送信（ログ）出力される。',
      )
      const response = await axios.patch(url, {
        user_id: testUserData[1]?.userId,
        status: UserStatus.INACTIVE,
      })
      expect(response.status).toBe(200)
    })
    it('休会から復帰した際には、最も参加人数が少ないチームかつペアに参加する。その場合にペアが４名になってしまう場合は、ペアを２つに分解する。', async () => {
      await cleaningAllTables()
      await seedsTransfer()
      const url = `http://localhost:3001/user`
      const response = await axios.patch(url, {
        user_id: testUserData[7]?.userId,
        status: UserStatus.ACTIVE,
      })
      expect(response.status).toBe(200)
      const result1 = await prisma.user.findUnique({
        where: { userId: testUserData[7]?.userId },
      })
      expect.any(result1?.teamId)
      expect.any(result1?.pairId)
      const result2 = await prisma.user.findMany({
        where: { pairId: result1?.pairId },
      })
      expect(result2.length).toBe(2)
    })
    it('休会から復帰した際には、最も参加人数が少ないチームかつペアに参加する。', async () => {
      await cleaningAllTables()
      const testTeamData: Prisma.TeamCreateInput[] = ([] = [
        {
          teamId: uuid(),
          teamName: '1',
        },
        {
          teamId: uuid(),
          teamName: '2',
        },
      ])
      const testPairData: Prisma.PairCreateInput[] = [
        {
          pairId: uuid(),
          pairName: 'A',
          team: {
            connect: { teamId: testTeamData[0]!.teamId },
          },
        },
        {
          pairId: uuid(),
          pairName: 'B',
          team: {
            connect: { teamId: testTeamData[0]!.teamId },
          },
        },
        {
          pairId: uuid(),
          pairName: 'C',
          team: {
            connect: { teamId: testTeamData[1]!.teamId },
          },
        },
        {
          pairId: uuid(),
          pairName: 'D',
          team: {
            connect: { teamId: testTeamData[1]!.teamId },
          },
        },
      ]
      const testUserData: Prisma.UserCreateInput[] = [
        {
          userId: uuid(),
          userName: 'test1',
          email: 'test1@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[0]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test2',
          email: 'test2@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[0]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test3',
          email: 'test3@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[0]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test4',
          email: 'test4@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[1]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test5',
          email: 'test5@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[1]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test6',
          email: 'test6@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[1]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[0]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test7',
          email: 'test7@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[2]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[1]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test8',
          email: 'test8@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[2]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[1]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test9',
          email: 'test9@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[3]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[1]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test10',
          email: 'test10@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[3]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[1]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test11',
          email: 'test11@example.com',
          status: UserStatus.ACTIVE,
          pair: {
            connect: { pairId: testPairData[3]?.pairId },
          },
          team: {
            connect: { teamId: testTeamData[1]?.teamId },
          },
        },
        {
          userId: uuid(),
          userName: 'test12',
          email: 'test12@example.com',
          status: UserStatus.INACTIVE,
        },
      ]
      await prisma.$transaction(
        testTeamData.map((d) => prisma.team.create({ data: d })),
      )
      await prisma.$transaction(
        testPairData.map((d) => prisma.pair.create({ data: d })),
      )
      await prisma.$transaction(
        testUserData.map((d) => prisma.user.create({ data: d })),
      )
      const url = `http://localhost:3001/user`

      const response = await axios.patch(url, {
        user_id: testUserData[11]?.userId,
        status: UserStatus.ACTIVE,
      })
      expect(response.status).toBe(200)
      const result = await prisma.user.findUnique({
        where: { userId: testUserData[11]?.userId },
      })
      expect(result?.pairId).toBe(testPairData[2]?.pairId)
      expect(result?.teamId).toBe(testTeamData[1]?.teamId)
    })
  })
})
