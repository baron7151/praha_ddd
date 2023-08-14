import { prisma } from 'src/prisma'

import {
  cleaningAllTables,
  seedsTransfer,
  testTeamData,
} from '@testUtil/initial_data/seed'
import { TeamDataQS } from '../../query-service/team-data-qs'

describe('team-data-qs.integration.ts', () => {
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {
    await cleaningAllTables()
    await prisma.$disconnect()
  })
  describe('getAllTeams', () => {
    it('should get all teams', async () => {
      const teamDataQS = new TeamDataQS()
      const result = await teamDataQS.getAllTeams()
      expect(result).toHaveLength(testTeamData.length)
    })
  })
})
