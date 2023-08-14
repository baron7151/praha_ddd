import { mockUserRepository } from '@testUtil/mock/infra/repository/repository.mock'
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
      expect(userName.value).toBe(testUserName)
      expect(email.value).toBe(testEmail)
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
        const testUser = {
          userId: uuid(),
          userName: 'test2',
          email: 'test2@example.com',
          status: UserStatus.ACTIVE,
        }

        const userEntity = UserFactory.create(testUser)
        const { userName, email, status } = userEntity.getAllProperties()
        expect(userEntity instanceof UserEntity).toBe(true)
        expect(userName.value).toBe(testUser.userName)
        expect(email.value).toBe(testUser.email)
        expect(status).toBe(testUser.status)
      })
    })
    describe('reconstruct', () => {
      it('should return the UserEntity', async () => {
        const testUser = {
          userId: uuid(),
          userName: 'test2',
          email: 'test2@example.com',
          status: UserStatus.ACTIVE,
        }
        const testUserEntity = UserFactory.create(testUser)
        mockUserRepository.exists = jest.fn().mockReturnValue(false)
        const userFactory = new UserFactory(mockUserRepository)

        const newUserName = 'test3'
        const newEmail = 'test3@example.com'
        const userEntity = await userFactory.reconstruct({
          userEntity: testUserEntity,
          newUserName: newUserName,
          newEmail: newEmail,
        })
        const { userName, email, status } = userEntity.getAllProperties()
        expect(userEntity instanceof UserEntity).toBe(true)
        expect(userName.value).toBe(newUserName)
        expect(email.value).toBe(newEmail)
        expect(status).toBe(testUser.status)
      })
    })
  })
})
