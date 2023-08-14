import { NotFoundException } from '@nestjs/common'
import { mockTeamRepository } from '@testUtil/mock/infra/repository/repository.mock'
import { PatchTeamDataUseCase } from 'src/app/team/patch-team-data-usecase'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamId, TeamName, TeamEntity } from 'src/domain/team/team-entity'
import { UserId } from 'src/domain/user/user-entity'

describe('PatchTeamDataUseCase', () => {
  let patchTeamDataUseCase: PatchTeamDataUseCase

  beforeEach(() => {
    patchTeamDataUseCase = new PatchTeamDataUseCase(mockTeamRepository)
  })

  describe('do', () => {
    it('should update team data when team exists', async () => {
      const teamId = new TeamId()
      const teamName = new TeamName('9')
      const updateTeamName = new TeamName('8')
      const pairId1 = new PairId()
      const pairId2 = new PairId()
      const pairId3 = new PairId()
      const pairIds = [pairId1, pairId2]
      const updatePairIds = [pairId3]

      const existingTeam = new TeamEntity(teamId, teamName, pairIds)
      mockTeamRepository.findByTeamId.mockResolvedValueOnce(existingTeam)

      await patchTeamDataUseCase.do({
        teamId: teamId.value,
        teamName: updateTeamName.value,
        pairIds: updatePairIds.map((pairId) => pairId.value),
      })

      expect(mockTeamRepository.findByTeamId).toHaveBeenCalledWith(teamId)
      expect(mockTeamRepository.save).toHaveBeenCalledWith(
        new TeamEntity(teamId, updateTeamName, updatePairIds),
      )
    })

    it('should throw an error when team does not exist', async () => {
      const teamId = new TeamId().value
      const teamName = new TeamName('1').value
      const pairIds = [new UserId().value, new UserId().value]

      mockTeamRepository.findByTeamId.mockResolvedValueOnce(null)

      await expect(
        patchTeamDataUseCase.do({ teamId, teamName, pairIds }),
      ).rejects.toThrow()
    })
  })
})
