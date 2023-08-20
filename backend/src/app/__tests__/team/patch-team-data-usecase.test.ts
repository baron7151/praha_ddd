import { NotFoundException } from '@nestjs/common'
import { mockTeamRepository } from '@testUtil/mock/infra/repository/repository.mock'
import { PatchTeamDataUseCase } from 'src/app/team/patch-team-data-usecase'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamId, TeamName, TeamEntity } from 'src/domain/team/team-entity'
import { TeamFactory } from 'src/domain/team/team-factory'
import { UserId } from 'src/domain/user/user-entity'
import { TeamRepository } from 'src/infra/db/repository/team-repository'

describe('PatchTeamDataUseCase', () => {
  let patchTeamDataUseCase: PatchTeamDataUseCase
  let teamRepository = new TeamRepository()
  let mockTeamFactory = new TeamFactory(teamRepository)

  beforeEach(() => {
    patchTeamDataUseCase = new PatchTeamDataUseCase(
      mockTeamRepository,
      mockTeamFactory,
    )
  })

  describe('do', () => {
    it('should update team data when team exists', async () => {
      const teamId = new TeamId()
      const teamName = new TeamName('9')
      const updateTeamName = new TeamName('8')
      const pairId1 = new PairId()
      const pairId2 = new PairId()
      const pairIds = [pairId1, pairId2]
      const existingTeam = new TeamEntity(teamId, teamName, pairIds)
      const updateTeam = new TeamEntity(teamId, updateTeamName, pairIds)
      mockTeamRepository.findByTeamId.mockResolvedValueOnce(existingTeam)
      mockTeamFactory.reconstruct = jest.fn().mockResolvedValueOnce(updateTeam)

      await patchTeamDataUseCase.do({
        teamId: teamId.value,
        teamName: updateTeamName.value,
      })

      expect(mockTeamRepository.findByTeamId).toHaveBeenCalledWith(teamId)
      expect(mockTeamRepository.save).toHaveBeenCalledWith(updateTeam)
    })

    it('should throw an error when team does not exist', async () => {
      const teamId = new TeamId().value
      const teamName = new TeamName('1').value
      const pairIds = [new UserId().value, new UserId().value]

      mockTeamRepository.findByTeamId.mockResolvedValueOnce(undefined)

      await expect(
        patchTeamDataUseCase.do({ teamId, teamName }),
      ).rejects.toThrow()
    })
  })
})
