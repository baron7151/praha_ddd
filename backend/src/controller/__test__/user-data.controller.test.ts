import { PrismaClient } from '@prisma/client'
import { GetUserDataUseCase } from 'src/app/get-user-data-usecase'
import { UserDataQS } from 'src/infra/db/query-service/user-data-qs'
import { GetUserDataResponse } from '../response/get-user-data-response'
import { UserController } from '../user-data.controller'
import { UserDataDTO } from 'src/app/query-service-interface/user-data-qs'

describe('UserController', () => {
  let userController: UserController
  let prismaClientMock: jest.Mocked<PrismaClient>
  let userDataQSMock: jest.Mocked<UserDataQS>
  let getUserDataUseCaseMock: jest.Mocked<GetUserDataUseCase>

  beforeEach(() => {
    prismaClientMock = new PrismaClient() as jest.Mocked<PrismaClient>
    userDataQSMock = new UserDataQS(prismaClientMock) as jest.Mocked<UserDataQS>
    getUserDataUseCaseMock = new GetUserDataUseCase(
      userDataQSMock,
    ) as jest.Mocked<GetUserDataUseCase>

    userController = new UserController()
    userController.findUserByName = jest.fn(userController.findUserByName)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('findUserByName', () => {
    it('', async () => {
      // Arrange
      const userId = '123456'
      const name = 'test1'
      const email = 'test@example.com'
      const status = 'registered'
      const mockResult = [
        new UserDataDTO({
          userId,
          name,
          email,
          status,
        }),
      ]
      const mockResponse = new GetUserDataResponse({ userDatas: mockResult })

      // Act
      const result = await userController.findUserByName(name)

      // Assert
      expect(result).toEqual(mockResponse)
    })
  })
})
