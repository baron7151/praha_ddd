import {
  cleaningAllTables,
  seedsTransfer,
  testPairData,
  testTeamData,
  testUserData,
} from '@testUtil/initial_data/seed'
import { TeamId, TeamName, TeamEntity } from 'src/domain/team/team-entity'
import { UserId } from 'src/domain/user/user-entity'
import { prisma } from 'src/prisma'
import { TeamRepository } from '../../repository/team-repository'
import { PairId } from 'src/domain/pair/pair-entity'

// テストコード
describe('TeamRepository', () => {
  let teamRepository: TeamRepository
  beforeAll(async () => {
    teamRepository = new TeamRepository()
    await cleaningAllTables()
    await seedsTransfer()
  })

  beforeEach(() => {})

  afterAll(async () => {
    cleaningAllTables()
    await prisma.$disconnect()
  })

  test('test findByTeamId()', async () => {
    // findメソッドを実行
    const result = await teamRepository.findByTeamId(
      new TeamId(testTeamData[0]!.teamId),
    )
    const resultAllProperties = result?.getAllProperties()
    expect(resultAllProperties?.teamId.value).toBe(testTeamData[0]?.teamId)
  })

  test('test exists()', async () => {
    // テストに必要なデータを作成
    const result = await teamRepository.exists(
      new TeamName(testTeamData[0]!.teamName),
    )
    expect(result).toBe(true)
  })

  describe('test save()', () => {
    const teamId = new TeamId()
    it('should save the team data(create)', async () => {
      const teamName = new TeamName('9')
      const team = new TeamEntity(teamId, teamName)
      await teamRepository.save(team)
      const result = await teamRepository.findByTeamId(teamId)
      expect(result?.getAllProperties()).toEqual({
        teamId: teamId,
        teamName: teamName,
      })
    })
    it('should save the team data(update)', async () => {
      const teamName = new TeamName('8')
      const team = new TeamEntity(teamId, teamName)
      await teamRepository.save(team)
      const result = await teamRepository.findByTeamId(teamId)
      expect(result?.getAllProperties()).toEqual({
        teamId: teamId,
        teamName: teamName,
      })
    })
  })
})
