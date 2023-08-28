import { mockTeamRepository } from '@testUtil/mock/infra/repository/repository.mock'
import { PairEntity, PairId, PairName } from '../pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from '../team/team-entity'
import { UserEntity, UserId } from '../user/user-entity'
import { TeamService } from '../team/team-service'

describe('TeamService', () => {
  const teamId1 = new TeamId()
  const teamId2 = new TeamId()
  const teamName1 = new TeamName('1')
  const teamName2 = new TeamName('2')
  const pairId1 = new PairId()
  const pairId2 = new PairId()
  const pairIds1 = [pairId1]
  const pairId3 = new PairId()
  const pairId4 = new PairId()
  const pairIds2 = [pairId2, pairId3]
  const userId1 = new UserId()
  const userId2 = new UserId()
  const userId3 = new UserId()
  const userIds1 = [userId1, userId2, userId3]
  const userId4 = new UserId()
  const userId5 = new UserId()
  const userId6 = new UserId()
  const userId7 = new UserId()
  const userIds2 = [userId4, userId5, userId6, userId7]
  const teamEntity1 = new TeamEntity(teamId1, teamName1, pairIds1, userIds1)
  const teamEntity2 = new TeamEntity(teamId2, teamName2, pairIds2, userIds2)
  const allTeamEntity = [teamEntity1, teamEntity2]

  describe('findMostFewMemberTeam()', () => {
    it('should return few member TeamEntity.', async () => {
      const teamService = new TeamService(mockTeamRepository)
      mockTeamRepository.findAllTeams = jest.fn().mockReturnValue(allTeamEntity)
      const result = await teamService.findMostFewMemberTeam()
      expect(result).toEqual(teamEntity1)
    })
  })
})
