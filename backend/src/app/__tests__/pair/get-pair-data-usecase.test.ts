import { GetPairDataUseCase } from '../../pair/get-pair-data-usecase'
import {
  IPairDataQS,
  PairDataDTO,
} from '../../query-service-interface/pair-data-qs'
import { UserDataDTO } from '../../query-service-interface/user-data-qs'

describe('get-pair-data-usecase', () => {
  let pairDataQS: IPairDataQS
  let getPairDataUseCase: GetPairDataUseCase

  beforeAll(() => {
    pairDataQS = {
      getAllPairs: jest.fn(),
    }
    getPairDataUseCase = new GetPairDataUseCase(pairDataQS)
  })

  beforeEach(() => {})

  describe('do', () => {
    it('should return the result from userDataQS.getAllPairs', async () => {
      const expectedPairs = [
        new PairDataDTO({
          pairId: '1',
          pairName: 'A',
          users: [
            new UserDataDTO({
              userId: '1',
              userName: 'test1',
              email: 'test1@excample.com',
              status: 'ACTIVE',
            }),
            new UserDataDTO({
              userId: '2',
              userName: 'test2',
              email: 'test2@excample.com',
              status: 'ACTIVE',
            }),
          ],
        }),
        new PairDataDTO({
          pairId: '2',
          pairName: 'B',
          users: [
            new UserDataDTO({
              userId: '3',
              userName: 'test3',
              email: 'test3@excample.com',
              status: 'ACTIVE',
            }),
            new UserDataDTO({
              userId: '4',
              userName: 'test4',
              email: 'test4@excample.com',
              status: 'ACTIVE',
            }),
          ],
        }),
      ]
      pairDataQS.getAllPairs = jest.fn().mockResolvedValue(expectedPairs)

      // Act
      const result = await getPairDataUseCase.do()

      // Assert
      expect(result).toEqual(expectedPairs)
    })
  })
})
