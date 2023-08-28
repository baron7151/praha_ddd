import { PairEntity, PairId, PairName } from '../pair/pair-entity'
import { TeamId } from '../team/team-entity'
import { UserId } from '../user/user-entity'

describe('PairEntity', () => {
  const pairId = new PairId()
  const pairName = new PairName('A')
  const teamId = new TeamId()
  const userId1 = new UserId()
  const userId2 = new UserId()
  const userId3 = new UserId()
  const userIds = [userId1, userId2, userId3]
  describe('constructor', () => {
    it('should create a PairEntity instance with valid user count', () => {
      expect(
        () => new PairEntity(pairId, pairName, teamId, userIds),
      ).not.toThrow()
    })
  })

  describe('changePairName', () => {
    it('should return a new PairEntity instance with the updated pair name', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      const newPairName = new PairName('B')

      const updatedPairEntity = pairEntity.changePairName(newPairName)

      expect(updatedPairEntity).toBeInstanceOf(PairEntity)
      expect(updatedPairEntity.getAllProperties().pairName).toEqual(newPairName)
    })
  })

  describe('equals', () => {
    it('should return true when comparing two equal PairEntity instances', () => {
      const pairEntity1 = new PairEntity(pairId, pairName, teamId, userIds)
      const pairEntity2 = new PairEntity(pairId, pairName, teamId, userIds)

      const result = pairEntity1.equals(pairEntity2)

      expect(result).toBe(true)
    })
  })
  describe('PairName', () => {
    describe('constructor', () => {
      it('should return a new PairName instance', () => {
        const pairName = new PairName('A')
        expect(pairName).toBeInstanceOf(PairName)
        expect(pairName.value).toBe('A')
      })
      it('should throw an error', () => {
        expect(() => new PairName('1')).toThrowError(
          'Pair Name must be alphabet.',
        )
        expect(() => new PairName('aa')).toThrowError(
          'Pair names must be one letter.',
        )
      })
    })
  })
  describe('getAllProperties', () => {
    it('should return all Pair properties.', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      expect(pairEntity.getAllProperties()).toEqual({
        pairId: pairId,
        pairName: pairName,
        teamId: teamId,
        userIds: userIds,
      })
    })
  })
  describe('checkPairUserCount', () => {
    it('should validate pair User count.', () => {
      expect(PairEntity.checkPairUserCount()).toBe(true)
      expect(PairEntity.checkPairUserCount(userIds)).toBe(true)
      expect(PairEntity.checkPairUserCount([userId1])).toBe(false)
    })
  })
  describe('getAllProperties', () => {
    it('should return all Pair properties.', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      expect(pairEntity.getAllProperties()).toEqual({
        pairId: pairId,
        pairName: pairName,
        teamId: teamId,
        userIds: userIds,
      })
    })
  })
  describe('getId', () => {
    it('should return a pairId.', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      expect(pairEntity.getId()).toEqual(pairId)
    })
  })

  describe('changeTeam', () => {
    it('should return a change team pairEntity.', () => {
      const updateTeam = new TeamId()
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      const result = pairEntity.changeTeam(updateTeam)
      expect(result.getAllProperties().teamId).toEqual(updateTeam)
    })
  })
  describe('isMinimumMemeber', () => {
    it('should validate min pair user', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      const pairEntity2 = new PairEntity(pairId, pairName, teamId, [
        userId1,
        userId2,
      ])
      expect(pairEntity.isMinimumMember()).toBe(false)
      expect(pairEntity2.isMinimumMember()).toBe(true)
    })
  })
  describe('isMaximumMember', () => {
    it('should validate max pair user', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      const pairEntity2 = new PairEntity(pairId, pairName, teamId, [
        userId1,
        userId2,
      ])
      expect(pairEntity.isMaximumMember()).toBe(true)
      expect(pairEntity2.isMaximumMember()).toBe(false)
    })
  })
  describe('isMoveablePair', () => {
    it('should check whether moveable pair.', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      const pairEntity2 = new PairEntity(pairId, pairName, teamId, [
        userId1,
        userId2,
      ])
      expect(pairEntity.isMoveablePair()).toBe(false)
      expect(pairEntity2.isMoveablePair()).toBe(true)
    })
  })
  describe('isPairMemberExists', () => {
    it('should check pair user exists.', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      const pairEntity2 = new PairEntity(pairId, pairName, teamId)
      expect(pairEntity.isPairMemberExists()).toBe(true)
      expect(pairEntity2.isPairMemberExists()).toBe(false)
    })
  })
  describe('countPairMemer', () => {
    it('should return Pair member count.', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      expect(pairEntity.countPairMemer()).toBe(3)
    })
  })
  describe('selectUserAtRandom', () => {
    it('should return pair user at random.', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      expect(pairEntity.selectUserAtRandom() instanceof UserId).toBe(true)
    })
  })
  describe('isBelongingToTeam', () => {
    it('should check whether pair belong to the team.', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      const pairEntity2 = new PairEntity(pairId, pairName)
      expect(pairEntity.isBelongingToTeam()).toBe(true)
      expect(pairEntity2.isBelongingToTeam()).toBe(false)
    })
  })
})
