import { UserDataDTO } from 'src/domain/user/user-dto'
import { GetUserDataUseCase } from '../get-user-data-usecase'
import { IUserDataQS } from '../query-service-interface/user-data-qs'

describe('PatchUserDataUseCase', () => {
  let userDataQS: IUserDataQS
  let getUserDataUseCase: GetUserDataUseCase

  beforeEach(() => {
    userDataQS = {
      getUsers: jest.fn(),
      getAllUsers: jest.fn(),
    }
    getUserDataUseCase = new GetUserDataUseCase(userDataQS)
  })

  describe('do', () => {
    it('should return the result from userDataQS.getUsers', async () => {
      // Arrange
      const testName = 'test1'
      const expectedUsers = [
        new UserDataDTO({
          userId: '1',
          userName: testName,
          email: 'test1@test.com',
          status: '在籍中',
        }),
      ]
      userDataQS.getUsers = jest.fn().mockResolvedValue(expectedUsers)

      // Act
      const result = await getUserDataUseCase.do(testName)

      // Assert
      expect(result).toEqual(expectedUsers)
    })

    it('should return the result from userDataQS.getAllUsers', async () => {
      const expectedUsers = [
        new UserDataDTO({
          userId: '1',
          userName: 'test1',
          email: 'test1@test.com',
          status: 'registerd',
        }),
        new UserDataDTO({
          userId: '2',
          userName: 'test2',
          email: 'test2@test.com',
          status: 'registred',
        }),
      ]
      userDataQS.getAllUsers = jest.fn().mockResolvedValue(expectedUsers)
      const result = await getUserDataUseCase.do()
      expect(result).toEqual(expectedUsers)
    })

    it('should re-throw any error from userDataQS.getUsers', async () => {
      // Arrange
      const testName = 'test1'
      const expectedError = new Error('Database error.')
      userDataQS.getUsers = jest.fn().mockRejectedValue(expectedError)

      // Act & Assert
      await expect(getUserDataUseCase.do(testName)).rejects.toThrow(
        expectedError,
      )
    })
  })
})
