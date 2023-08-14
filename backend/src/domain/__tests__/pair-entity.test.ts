import { PairEntity, PairId, PairName } from '../pair/pair-entity'
import { TeamId } from '../team/team-entity'
import { UserId } from '../user/user-entity'

describe('PairEntity', () => {
  const pairId = new PairId() // PairId の適切な値を設定してください
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

  describe('removePairUser', () => {
    it('should return a new PairEntity instance with the specified user removed', () => {
      const pairEntity = new PairEntity(pairId, pairName, teamId, userIds)
      const updatedPairEntity = pairEntity.removePairUser(userId3)

      expect(updatedPairEntity).toBeInstanceOf(PairEntity)
      expect(updatedPairEntity.getAllProperties().userIds?.length).toEqual(2)
    })
  })

  describe('addPairUser', () => {
    it('should return a new PairEntity instance with the specified user added', () => {
      const pairEntity = new PairEntity(
        pairId,
        pairName,
        teamId,
        userIds.slice(1, 3),
      )
      const updatedPairEntity = pairEntity.addPairUser(userId3)

      expect(updatedPairEntity).toBeInstanceOf(PairEntity)
      expect(updatedPairEntity.getAllProperties().userIds?.length).toEqual(3)
    })
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
