import { mockUserRepository } from '@testUtil/mock/infra/repository/user-data-repository.mock'
import { UserFactory } from '../user/user-factory'
import { uuid } from 'uuidv4'
import { UserStatus, UserEntity } from '../user/user-entity'

describe('UserFactory', () => {
  beforeEach(() => {})

  describe('addUser', () => {
    it('should return the UseEntity', async () => {
      const testUserId = uuid()
      const testUserName = 'test1'
      const testEmail = 'test1@example.com'
      const testStatus = UserStatus.ACTIVE
      mockUserRepository.exists = jest.fn().mockReturnValue(false)
      const userFactory = new UserFactory(mockUserRepository)

      const userEntity = await userFactory.addUser(testUserName, testEmail)

      const { userName, email } = userEntity.getAllProperties()
      expect(userEntity instanceof UserEntity).toBe(true)
      expect(userName).toBe(testUserName)
      expect(email).toBe(testEmail)
    })

    it('should return the Error', async () => {
      const testUserName = 'test1'
      const testEmail = 'test1@example.com'
      mockUserRepository.exists = jest.fn().mockReturnValue(true)
      const userFactory = new UserFactory(mockUserRepository)
      await expect(
        userFactory.addUser(testUserName, testEmail),
      ).rejects.toThrowError(`This Email is already registered. ${testEmail}`)
    })

    describe('create', () => {
      it('should return the UserEntity', () => {
        const testUserId = uuid()
        const testUserName = 'test2'
        const testEmail = 'test2@example.com'
        const testStatus = UserStatus.INACTIVE
        const userEntity = UserFactory.create(
          testUserId,
          testUserName,
          testEmail,
          testStatus,
        )
        const { userName, email, status } = userEntity.getAllProperties()
        expect(userEntity instanceof UserEntity).toBe(true)
        expect(userName).toBe(testUserName)
        expect(email).toBe(testEmail)
        expect(status).toBe(testStatus)
      })
    })
    describe('reconstruct', () => {
      it('should return the UserEntity', () => {
        const testUserId = uuid()
        const testUserName = 'test2'
        const testEmail = 'test2@example.com'
        const testStatus = UserStatus.INACTIVE
        const testUserEntity = UserFactory.create(
          testUserId,
          testUserName,
          testEmail,
          testStatus,
        )
        const updateUserName = 'test3'
        const updateEmail = 'test3@example.com'
        const userEntity = UserFactory.reconstruct(
          testUserEntity,
          updateUserName,
          updateEmail,
        )
        const { userName, email, status } = userEntity.getAllProperties()
        expect(userEntity instanceof UserEntity).toBe(true)
        expect(userName).toBe(updateUserName)
        expect(email).toBe(updateEmail)
        expect(status).toBe(testStatus)
      })
    })
  })
})
