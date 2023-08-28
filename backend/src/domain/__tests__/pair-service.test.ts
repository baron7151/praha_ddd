// write unit test for PairService
import {
  mockPairRepository,
  mockTeamRepository,
} from '@testUtil/mock/infra/repository/repository.mock'
import { PairEntity, PairId, PairName } from '../pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from '../team/team-entity'
import { UserEntity, UserId } from '../user/user-entity'
import { TeamService } from '../team/team-service'
import { PairService } from '../pair/pair-service'

describe('Test PairService', () => {
  const pairId = new PairId()
  const pairId2 = new PairId()
  const pairName = new PairName('a')
  const pairName2 = new PairName('b')
  const teamId = new TeamId()
  const userId1 = new UserId()
  const userId2 = new UserId()
  const userId3 = new UserId()
  const userId4 = new UserId()
  const userId5 = new UserId()
  const userIds = [userId1, userId2, userId3]
  const userIds2 = [userId4, userId5]
  const pair = new PairEntity(pairId, pairName, teamId, userIds)
  const pair2 = new PairEntity(pairId2, pairName2, teamId, userIds2)
  const pairService = new PairService(mockPairRepository)
  describe('test findMovablePair()', () => {
    it('should return moveable PairEntity.', async () => {
      const pairEntityies = [pair, pair2]
      const result = PairService.findMovablePair(pairEntityies)
      expect(result).toEqual(pair2)
    })
  })
  describe('test findMostFewMemberPairByTeamId()', () => {
    it('should return few member PairEntity.', async () => {
      const pairEntities = [pair, pair2]
      mockPairRepository.findByTeamId = jest.fn().mockReturnValue(pairEntities)
      const result = await pairService.findMostFewMemberPairByTeamId(teamId)
      expect(result).toEqual(pair2)
    })
  })
  describe('test autoPairCreate()', () => {
    it('should return new PairEntity.', async () => {
      mockPairRepository.exists = jest.fn().mockReturnValue(false)
      const result = await pairService.autoPairCreate()
      expect(result).toBeInstanceOf(PairEntity)
    })
  })
})
