import { UserId } from 'src/domain/user/user-entity'
import { PairRepository } from '../../repository/pair-repository'
import { PairEntity, PairId, PairName } from 'src/domain/pair/pair-entity'
import {
  cleaningAllTables,
  seedsTransfer,
  testPairData,
  testTeamData,
  testUserData,
} from '@testUtil/initial_data/seed'
import { prisma } from 'src/prisma'
import { TeamId } from 'src/domain/team/team-entity'

// テストコード
describe('PairRepository', () => {
  let pairRepository: PairRepository
  beforeAll(async () => {
    pairRepository = new PairRepository()
    await cleaningAllTables()
    await seedsTransfer()
  })

  beforeEach(() => {})

  afterAll(async () => {
    cleaningAllTables()
    await prisma.$disconnect()
  })

  test('test findByPairId()', async () => {
    // findメソッドを実行
    const result = await pairRepository.findByPairId(
      new PairId(testPairData[0]!.pairId),
    )
    const resultAllProperties = result?.getAllProperties()
    expect(resultAllProperties?.pairId.value).toBe(testPairData[0]?.pairId)
  })

  test('test exists()', async () => {
    // テストに必要なデータを作成
    const result = await pairRepository.exists(
      new PairName(testPairData[0]!.pairName),
    )
    expect(result).toBe(true)
  })

  describe('test save()', () => {
    it('should save the pair data(create)', async () => {
      const pairId = new PairId()
      const pairName = new PairName('Z')
      const userId1 = new UserId(testUserData[5]?.userId)
      const userId2 = new UserId(testUserData[6]?.userId)
      const teamId = new TeamId(testTeamData[0]?.teamId)
      const userIds = [userId1, userId2]
      const pair = new PairEntity(pairId, pairName, teamId, userIds)
      await pairRepository.save(pair)
      const result = await pairRepository.findByPairId(pairId)
      expect(result?.getAllProperties()).toEqual({
        pairId: pairId,
        pairName: pairName,
        teamId: teamId,
        userIds: userIds,
      })
    })
    it('should save the pair data(update)', async () => {
      await cleaningAllTables()
      await seedsTransfer()
      const pairId = new PairId(testPairData[0]!.pairId)
      const pairName = new PairName('X')
      const userId1 = new UserId(testUserData[5]?.userId)
      const userId2 = new UserId(testUserData[6]?.userId)
      const teamId = new TeamId(testTeamData[0]?.teamId)
      const userIds = [userId1, userId2]
      const pair = new PairEntity(pairId, pairName, teamId, userIds)
      await pairRepository.save(pair)
      const result = await pairRepository.findByPairId(pairId)
      expect(result?.getAllProperties()).toEqual({
        pairId: pairId,
        pairName: pairName,
        teamId: teamId,
        userIds: userIds,
      })
    })
  })
})
