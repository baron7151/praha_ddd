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
    const pairId = new PairId()
    it('should save the pair data(create)', async () => {
      const pairName = new PairName('Z')
      const teamId = new TeamId(testTeamData[0]?.teamId)
      const pair = new PairEntity(pairId, pairName, teamId)
      await pairRepository.save(pair)
      const result = await prisma.pair.findUnique({
        where: { pairId: pairId.value },
      })

      expect(result?.pairId).toBe(pairId.value)
      expect(result?.pairName).toBe(pairName.value)
      expect(result?.teamId).toBe(teamId.value)
    })
    it('should save the pair data(update)', async () => {
      const pairName = new PairName('X')
      const teamId = new TeamId(testTeamData[1]?.teamId)
      const pair = new PairEntity(pairId, pairName, teamId)
      await pairRepository.save(pair)
      const result = await prisma.pair.findUnique({
        where: { pairId: pairId.value },
      })
      expect(result?.pairId).toBe(pairId.value)
      expect(result?.pairName).toBe(pairName.value)
      expect(result?.teamId).toBe(teamId.value)
    })
  })
  describe('test findByTeamId()', () => {
    it('should return pairEntities.', async () => {
      const teamId = new TeamId(testTeamData[0]?.teamId)
      const result = await pairRepository.findByTeamId(teamId)
      result!.forEach((pairEntity) => {
        expect(pairEntity.getAllProperties().teamId).toEqual(teamId)
      })
    })
  })
})
