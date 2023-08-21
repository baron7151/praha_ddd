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

describe('PairFactory', () => {
  beforeEach(() => {})

  describe('create', () => {
    it('should return the PairEntity', async () => {
      const testPair1 = {
        pairId: new PairId().value,
        pairName: new PairName('a').value,
        teamId: new TeamId().value,
        userIds: [new UserId().value, new UserId().value],
      }
      const pairEntity = PairFactory.create(testPair1)

      expect(pairEntity instanceof PairEntity).toBe(true)
    })

    describe('reconstruct', () => {
      it('should return the PairEntity', async () => {
        const testPair1 = {
          pairId: new PairId().value,
          pairName: new PairName('a').value,
          teamId: new TeamId().value,
          userIds: [new UserId().value, new UserId().value],
        }
        const pairEntity = PairFactory.create(testPair1)
        const updateTestPair = {
          pairName: new PairName('b').value,
          teamId: new TeamId().value,
          userIds: [new UserId().value, new UserId().value],
        }
        const pairFactory = new PairFactory(
          mockPairRepository,
          mockTeamRepository,
          mockUserRepository,
        )

        mockPairRepository.exists = jest.fn().mockReturnValue(false)
        mockTeamRepository.findByTeamId = jest
          .fn()
          .mockReturnValue(
            new TeamEntity(
              new TeamId(),
              new TeamName('1'),
              [new PairId()],
              [new UserId(), new UserId(), new UserId()],
            ),
          )
        mockUserRepository.findByUserId = jest
          .fn()
          .mockReturnValue(
            new UserEntity(
              new UserId(),
              new UserName('test1'),
              new Email('test1@example.com'),
              UserStatus.ACTIVE,
            ),
          )
        const updatePairEntity = await pairFactory.reconstruct({
          pairEntity: pairEntity,
          newPairName: updateTestPair.pairName,
          newTeamId: updateTestPair.teamId,
          newUserIds: updateTestPair.userIds,
        })

        const { pairId, pairName, userIds, teamId } =
          updatePairEntity.getAllProperties()
        expect(pairId.value).toBe(testPair1.pairId)
        expect(pairName.value).toBe(updateTestPair.pairName)
        expect(teamId!.value).toBe(updateTestPair.teamId)
        expect(userIds?.map((userId) => userId.value)).toEqual(
          updateTestPair.userIds,
        )
      })
    })
  })
})
