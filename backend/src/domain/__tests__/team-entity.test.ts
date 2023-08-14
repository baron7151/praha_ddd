import { PairEntity, PairId, PairName } from '../pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from '../team/team-entity'
import { UserId } from '../user/user-entity'

describe('TeamEntity', () => {
  const teamId = new TeamId()
  const teamName = new TeamName('1')
  const pairId1 = new PairId()
  const pairId2 = new PairId()
  const pairId3 = new PairId()
  const pairIds = [pairId1, pairId2, pairId3]

  describe('constructor', () => {
    it('should create a TeamEntity instance with valid user count', () => {
      expect(() => new TeamEntity(teamId, teamName, pairIds)).not.toThrow()
    })
  })

  describe('changeTeamName', () => {
    it('should return a new PairEntity instance with the updated pair name', () => {
      const teamEntity = new TeamEntity(teamId, teamName, pairIds)
      const newTeamName = new TeamName('2')

      const updatedTeamEntity = teamEntity.changeTeamName(newTeamName)

      expect(updatedTeamEntity).toBeInstanceOf(TeamEntity)
      expect(updatedTeamEntity.getAllProperties().teamName).toEqual(newTeamName)
    })
  })

  describe('equals', () => {
    it('should return true when comparing two equal TeamEntity instances', () => {
      const teamEntity1 = new TeamEntity(teamId, teamName, pairIds)
      const teamEntity2 = new TeamEntity(teamId, teamName, pairIds)

      const result = teamEntity1.equals(teamEntity2)

      expect(result).toBe(true)
    })
  })

  // describe('removePairUser', () => {
  //   it('should return a new PairEntity instance with the specified user removed', () => {
  //     const pairEntity = new PairEntity(pairId, pairName, userIds)
  //     const updatedPairEntity = pairEntity.removePairUser(userId3)

  //     expect(updatedPairEntity).toBeInstanceOf(PairEntity)
  //     expect(updatedPairEntity.getAllProperties().userIds?.length).toEqual(2)
  //   })
  // })

  // describe('addPairUser', () => {
  //   it('should return a new PairEntity instance with the specified user added', () => {
  //     const pairEntity = new PairEntity(pairId, pairName, userIds.slice(1, 3))
  //     const updatedPairEntity = pairEntity.addPairUser(userId3)

  //     expect(updatedPairEntity).toBeInstanceOf(PairEntity)
  //     expect(updatedPairEntity.getAllProperties().userIds?.length).toEqual(3)
  //   })
  // })
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
