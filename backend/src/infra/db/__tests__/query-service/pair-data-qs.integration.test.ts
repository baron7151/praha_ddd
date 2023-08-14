import { prisma } from 'src/prisma'

import {
  cleaningAllTables,
  seedsTransfer,
  testPairData,
} from '@testUtil/initial_data/seed'
import { PairDataQS } from '../../query-service/pair-data-qs'

describe('pair-data-qs.integration.ts', () => {
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })
  afterAll(async () => {
    await cleaningAllTables()
    await prisma.$disconnect()
  })
  describe('getAllPairs', () => {
    it('should get all pairs', async () => {
      const userDataQS = new PairDataQS()
      const result = await userDataQS.getAllPairs()
      expect(result).toHaveLength(testPairData.length)
    })
  })
})
