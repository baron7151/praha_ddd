import { GetUserDataUseCase } from '../get-user-data-usecase'
import {
  IUserDataQS,
  UserDataDTO,
} from '../query-service-interface/user-data-qs'

describe('GetUserDataUseCase', () => {
  let userDataQS: IUserDataQS
  let getUserDataUseCase: GetUserDataUseCase

  beforeEach(() => {
    userDataQS = {
      getUsers: jest.fn(),
    }
    getUserDataUseCase = new GetUserDataUseCase(userDataQS)
  })

  describe('do', () => {
    it('should return the result from userDataQS.getUsers', async () => {
      // Arrange
      const testName = 'test1'
      const expectedUsers = [
        new UserDataDTO({
          id: '1',
          name: testName,
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

    it('should re-throw any error from userDataQS.getUsers', async () => {
      // Arrange
      const testName = 'test1'
      const expectedError = new Error('Database error')
      userDataQS.getUsers = jest.fn().mockRejectedValue(expectedError)

      // Act & Assert
      await expect(getUserDataUseCase.do(testName)).rejects.toThrow(
        expectedError,
      )
    })
  })
})
