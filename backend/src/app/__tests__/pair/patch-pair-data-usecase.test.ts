import { PairEntity, PairId, PairName } from 'src/domain/pair/pair-entity'
import { IPairRepository } from 'src/domain/pair/pair-repository'
import { UserId } from 'src/domain/user/user-entity'
import {
  mockPairRepository,
  mockTeamRepository,
  mockUserRepository,
} from '@testUtil/mock/infra/repository/repository.mock'
import { PatchPairDataUseCase } from 'src/app/pair/patch-pair-data-usecase'
import { TeamId } from 'src/domain/team/team-entity'
import { PairFactory } from 'src/domain/pair/pair-factory'
import { UserFactory } from 'src/domain/user/user-factory'

describe('PatchPairDataUseCase', () => {
  let patchPairDataUseCase: PatchPairDataUseCase
  const pairFactory = new PairFactory(
    mockPairRepository,
    mockTeamRepository,
    mockUserRepository,
  )
  patchPairDataUseCase = new PatchPairDataUseCase(
    mockPairRepository,
    pairFactory,
  )

  beforeEach(() => {})

  describe('do', () => {
    it('should update pair data when pair exists', async () => {
      const pairId = new PairId()
      const pairName = new PairName('A')
      const updatePairName = new PairName('B')
      const user1 = new UserId()
      const user2 = new UserId()
      const teamId = new TeamId()
      const updateTeamId = new TeamId()
      const userIds = [user1, user2]

      const existingPair = new PairEntity(pairId, pairName, teamId, userIds)
      const updatePair = new PairEntity(
        pairId,
        updatePairName,
        updateTeamId,
        userIds,
      )
      mockPairRepository.findByPairId.mockResolvedValueOnce(existingPair)
      pairFactory.reconstruct = jest.fn().mockResolvedValueOnce(updatePair)
      await patchPairDataUseCase.do({
        pairId: pairId.value,
        pairName: updatePairName.value,
        teamId: updateTeamId.value,
      })

      expect(mockPairRepository.findByPairId).toHaveBeenCalledWith(pairId)
      expect(mockPairRepository.save).toHaveBeenCalledWith(updatePair)
    })

    it('should throw an error when pair does not exist', async () => {
      const pairId = new PairId().value
      const pairName = new PairName('A').value
      const teamId = new TeamId().value

      mockPairRepository.findByPairId.mockResolvedValueOnce(null)

      await expect(
        patchPairDataUseCase.do({ pairId, pairName, teamId }),
      ).rejects.toThrowError('更新するリソースがありません。')
    })
  })
})
