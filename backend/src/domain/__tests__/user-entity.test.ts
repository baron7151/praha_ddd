import { uuid } from 'uuidv4'
import { UserEntity, UserId, UserName, UserStatus } from '../user/user-entity'
import { Email } from '../common/email'

describe('UserEntity', () => {
  const testUserId = new UserId(uuid())
  const testUserName = new UserName('test1')
  const testEmail = new Email('test1@example.com')
  const testStatus = UserStatus.ACTIVE
  describe('getAllProperties()', () => {
    it('should create UserEntity instance', () => {
      const user = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
      )
      expect(user).toBeInstanceOf(UserEntity)
      expect(user.getAllProperties()).toEqual({
        userId: testUserId.value,
        userName: testUserName.value,
        email: testEmail.value,
        status: testStatus,
        pairId: undefined,
        teamId: undefined,
        taskProgressId: undefined,
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
      )
      const user2 = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
      )
      const user3 = new UserEntity(
        new UserId(uuid()),
        testUserName,
        testEmail,
        testStatus,
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
    it('should change user status', () => {
      const user = new UserEntity(
        testUserId,
        testUserName,
        testEmail,
        testStatus,
      )

      const newUser = user.changeStatus(UserStatus.INACTIVE)

      expect(newUser.getAllProperties()).toEqual({
        userId: testUserId.value,
        userName: testUserName.value,
        email: testEmail.value,
        status: UserStatus.INACTIVE,
        pairId: undefined,
        teamId: undefined,
        taskProgressId: undefined,
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
      )
      const newUser = user.changeUserName(new UserName('Jane Smith'))

      expect(newUser.getAllProperties()).toEqual({
        userId: testUserId.value,
        userName: 'Jane Smith',
        email: testEmail.value,
        status: testStatus,
        pairId: undefined,
        teamId: undefined,
        taskProgressId: undefined,
      })
    })
  })
})
