import { uuid } from 'uuidv4'
import { UserEntity, UserId, UserName, UserStatus } from '../user/user-entity'

import { Email } from '../common/email'
import { PairId } from '../pair/pair-entity'
import { TeamId } from '../team/team-entity'

describe('UserEntity', () => {
  const testUserId = new UserId(uuid())
  const testUserName = new UserName('test1')
  const testEmail = new Email('test1@example.com')
  const testStatus = UserStatus.ACTIVE
  const testPairId = new PairId()
  describe('getAllProperties()', () => {
    it('should create UserEntity instance', () => {
      const user = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )
      expect(user).toBeInstanceOf(UserEntity)
      expect(user.getAllProperties()).toEqual({
        userId: testUserId,
        userName: testUserName,
        email: testEmail,
        status: testStatus,
        pairId: testPairId,
      })
    })
  })
  describe('equal()', () => {
    it('should check equality between UserEntity instances', () => {
      const user1 = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )
      const user2 = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )
      const user3 = new UserEntity(
        new UserId(uuid()),
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )

      expect(user1.equals(user2)).toBe(true)
      expect(user1.equals(user3)).toBe(false)
    })
  })
  describe('canJoin()', () => {
    it('should check if user can join', () => {
      const activeUser = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )
      const inActiveUser = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        UserStatus.INACTIVE,
      )

      expect(activeUser.canJoin()).toBe(true)
      expect(inActiveUser.canJoin()).toBe(false)
    })
  })
  describe('changeStatus()', () => {
    it('ACTIVE', () => {
      const user = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        UserStatus.INACTIVE,
      )

      const newUser = user.changeStatus(UserStatus.ACTIVE)

      expect(newUser.getAllProperties()).toEqual({
        userId: testUserId,
        userName: testUserName,
        email: testEmail,
        status: UserStatus.ACTIVE,
      })
    })
    it('INACTIVE', () => {
      const user = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )

      const newUser = user.changeStatus(UserStatus.INACTIVE)

      expect(newUser.getAllProperties()).toEqual({
        userId: testUserId,
        userName: testUserName,
        email: testEmail,
        status: UserStatus.INACTIVE,
        pairId: undefined,
      })
    })
    it('DELETE', () => {
      const user = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )

      const newUser = user.changeStatus(UserStatus.DELETE)

      expect(newUser.getAllProperties()).toEqual({
        userId: testUserId,
        userName: testUserName,
        email: testEmail,
        status: UserStatus.DELETE,
        pairId: undefined,
      })
    })
  })
  describe('changeUserName()', () => {
    it('should change user name', () => {
      const user = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )
      const newUser = user.changeUserName(new UserName('Jane Smith'))

      expect(newUser.getAllProperties()).toEqual({
        userId: testUserId,
        userName: new UserName('Jane Smith'),
        email: testEmail,
        status: testStatus,
        pairId: testPairId,
      })
    })
  })
  describe('changeEmail()', () => {
    it('should change user email', () => {
      const user = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
        testPairId,
      )
      const newUser = user.changeEmail(new Email('test2@example.com'))

      expect(newUser.getAllProperties()).toEqual({
        userId: testUserId,
        userName: testUserName,
        email: new Email('test2@example.com'),
        status: testStatus,
        pairId: testPairId,
      })
    })
  })
  describe('checkUserStatusAndPairAndTeam()', () => {
    it('', () => {
      expect(
        UserEntity.checkUserStatusAndPairAndTeam(
          UserStatus.ACTIVE,
          new PairId(),
          new TeamId(),
        ),
      ).toBe(false)
      expect(
        UserEntity.checkUserStatusAndPairAndTeam(
          UserStatus.INACTIVE,
          new PairId(),
        ),
      ).toBe(true)
      expect(
        UserEntity.checkUserStatusAndPairAndTeam(
          UserStatus.DELETE,
          new PairId(),
        ),
      ).toBe(true)
      expect(UserEntity.checkUserStatusAndPairAndTeam(UserStatus.DELETE)).toBe(
        false,
      )
    })
  })
})
