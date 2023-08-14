import { PairDataDTO } from 'src/app/query-service-interface/pair-data-qs'
import {
  ITeamDataQS,
  TeamDataDTO,
} from 'src/app/query-service-interface/team-data-qs'
import { GetTeamDataUseCase } from 'src/app/team/get-team-data-usecase'
import { uuid } from 'uuidv4'

describe('get-tem-data-usecase', () => {
  let teamDataQS: ITeamDataQS
  let getTeamDataUseCase: GetTeamDataUseCase

  beforeAll(() => {
    teamDataQS = {
      getAllTeams: jest.fn(),
    }
    getTeamDataUseCase = new GetTeamDataUseCase(teamDataQS)
  })

  beforeEach(() => {})

  describe('do', () => {
    it('should return the result from teamDataQS.getAllTeams', async () => {
      const expectedTeams = [
        new TeamDataDTO({
          teamId: uuid(),
          teamName: '1',
          pairs: [
            new PairDataDTO({
              pairId: uuid(),
              pairName: 'A',
            }),
            new PairDataDTO({
              pairId: uuid(),
              pairName: 'B',
            }),
          ],
        }),
        new TeamDataDTO({
          teamId: uuid(),
          teamName: '2',
        }),
      ]

      teamDataQS.getAllTeams = jest.fn().mockResolvedValue(expectedTeams)

      // Act
      const result = await getTeamDataUseCase.do()

      // Assert
      expect(result).toEqual(expectedTeams)
    })
  })
})
