//import { SomeData } from 'src/domain/some-data/some-data'
//import { createRandomIdString } from 'src/util/random'
import { prisma } from 'src/prisma'
import axios, { isCancel, AxiosError } from 'axios'
import { UserStatus } from 'src/domain/user/user-entity'
import {
  cleaningAllTables,
  seedsTransfer,
  testTeamData,
  testPairData,
} from '@testUtil/initial_data/seed'

describe('/team', () => {
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {
    await cleaningAllTables()
    await prisma.$disconnect()
  })
  describe('GET /team', () => {
    it('GET All Teams', async () => {
      const url = `http://localhost:3001/team`
      const response = await axios.get(url)
      expect(response.status).toBe(200)
      expect(response.data.teamDatas.length).toBe(testTeamData.length)
    })
  })

  describe('Patch /team', () => {
    it('', async () => {
      const updateTeamName = '9'
      const updateTeamPairs = [testPairData[1]?.pairId, testPairData[2]?.pairId]
      const url = `http://localhost:3001/team`

      const response = await axios.patch(url, {
        team_id: testTeamData[1]?.teamId,
        team_name: updateTeamName,
        pair_ids: updateTeamPairs,
      })
      expect(response.status).toBe(200)
    })
  })
})
