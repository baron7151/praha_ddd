import {
  mockPairRepository,
  mockTeamRepository,
  mockUserRepository,
} from '@testUtil/mock/infra/repository/repository.mock'
import { UserFactory } from '../user/user-factory'
import { uuid } from 'uuidv4'
import { UserStatus, UserEntity, UserId, UserName } from '../user/user-entity'
import { PairEntity, PairId, PairName } from '../pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from '../team/team-entity'
import { PairFactory } from '../pair/pair-factory'
import { Email } from '../common/email'
import { TeamFactory } from '../team/team-factory'

describe('TeamFactory', () => {
  beforeEach(() => {})
  const testTeamData1 = {
    teamId: new TeamId().value,
    teamName: new TeamName('1').value,
    pairIds: [new TeamId().value, new PairId().value],
    userIds: [new UserId().value, new UserId().value, new UserId().value],
  }
  describe('create', () => {
    it('should return the TeamEntity', async () => {
      const teamEntity = TeamFactory.create(testTeamData1)

      expect(teamEntity instanceof TeamEntity).toBe(true)
      expect(teamEntity.getId().value).toBe(testTeamData1.teamId)
    })

    describe('reconstruct', () => {
      it('should return update TeamEntity', async () => {
        const teamEntity = TeamFactory.create(testTeamData1)
        const updateTeamName = new TeamName('2')
        const teamFactory = new TeamFactory(mockTeamRepository)

        mockTeamRepository.exists = jest.fn().mockReturnValue(false)

        const updateTeamEntity = await teamFactory.reconstruct({
          teamEntity: teamEntity,
          newTeamName: updateTeamName.value,
        })

        expect(updateTeamEntity.getAllProperties().teamName).toEqual(
          updateTeamName,
        )
      })
    })
  })
})
