import { PairEntity, PairId, PairName } from '../pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from '../team/team-entity'
import { UserEntity, UserId } from '../user/user-entity'

describe('TeamEntity', () => {
  const teamId = new TeamId()
  const teamName = new TeamName('1')
  const pairId1 = new PairId()
  const pairId2 = new PairId()
  const pairId3 = new PairId()
  const pairIds = [pairId1, pairId2, pairId3]
  const userId1 = new UserId()
  const userId2 = new UserId()
  const userId3 = new UserId()
  const userIds = [userId1, userId2, userId3]
  const teamEntity = new TeamEntity(teamId, teamName, pairIds, userIds)

  describe('constructor', () => {
    it('should create a TeamEntity instance with valid user count', () => {
      expect(() => new TeamEntity(teamId, teamName, pairIds)).not.toThrow()
    })
  })

  describe('changeTeamName', () => {
    it('should return a new PairEntity instance with the updated pair name', () => {
      const newTeamName = new TeamName('2')

      const updatedTeamEntity = teamEntity.changeTeamName(newTeamName)

      expect(updatedTeamEntity).toBeInstanceOf(TeamEntity)
      expect(updatedTeamEntity.getAllProperties().teamName).toEqual(newTeamName)
    })
  })

  describe('equals', () => {
    it('should return true when comparing two equal TeamEntity instances', () => {
      const teamEntity1 = new TeamEntity(teamId, teamName, pairIds)

      const result = teamEntity.equals(teamEntity1)

      expect(result).toBe(true)
    })
  })
  describe('getAllProperties()', () => {
    it('should get All TeamEntity properties.', () => {
      expect(teamEntity.getAllProperties()).toEqual({
        teamId: teamId,
        teamName: teamName,
        pairIds: pairIds,
        userIds: userIds,
      })
    })
  })
  describe('validateTeamUserCount()', () => {
    it('should validate user count', () => {
      expect(TeamEntity.validateTeamUserCount()).toBe(true)
      expect(TeamEntity.validateTeamUserCount([new UserId()])).toBe(false)
      expect(
        TeamEntity.validateTeamUserCount([
          new UserId(),
          new UserId(),
          new UserId(),
        ]),
      ).toBe(true)
    })
  })
  describe('countTeamUser()', () => {
    it('should return User Count.', () => {
      expect(teamEntity.countTeamUser()).toBe(userIds.length)
    })
  })
  describe('getId()', () => {
    it('should return team id.', () => {
      expect(teamEntity.getId()).toEqual(teamId)
    })
  })
  describe('isMinimumMember()', () => {
    it('sholud check user count. ', () => {
      expect(teamEntity.isMinimumMember()).toBe(true)
    })
  })
})

describe('TeamName', () => {
  describe('constructor', () => {
    it('should return a new TeamName instance', () => {
      const teamName = new TeamName('1')
      expect(teamName).toBeInstanceOf(TeamName)
      expect(teamName.value).toBe('1')
    })
    it('should throw an error', () => {
      expect(() => new TeamName('a')).toThrowError('Team Name must be numbers.')
      expect(() => new TeamName('1111111')).toThrowError(
        'Team names must be at least one and no more than three letters.',
      )
    })
  })
})
