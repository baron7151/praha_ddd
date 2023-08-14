import { mockTaskProgressRepository } from '@testUtil/mock/infra/repository/repository.mock'
import { PatchTaskProgressDataUseCase } from 'src/app/task-progress/patch-task-progress-data-usecase'
import {
  TaskProgressEntity,
  TaskProgressId,
  TaskStatus,
} from 'src/domain/task-progress/task-progress-entity'
import { ITaskProgressRepository } from 'src/domain/task-progress/task-progress-repository'
import { TaskId } from 'src/domain/task/task-entity'
import { UserId, UserName } from 'src/domain/user/user-entity'
import { uuid } from 'uuidv4'

describe('get-task-progress-data-usecase', () => {
  let patchTaskProgressDataUseCase: PatchTaskProgressDataUseCase

  beforeAll(() => {
    patchTaskProgressDataUseCase = new PatchTaskProgressDataUseCase(
      mockTaskProgressRepository,
    )
  })

  beforeEach(() => {})

  describe('do', () => {
    it('not return', async () => {
      const taskProgressId = new TaskProgressId()
      const beforeTaskStatus = TaskStatus.NOT_STARTED
      const afterTaskStatus = TaskStatus.COMPLETED
      const beforeTaskProgressEntity = new TaskProgressEntity(
        taskProgressId,
        new TaskId(),
        new UserId(),
        new UserName('test1'),
        'DB1',
        beforeTaskStatus,
      )
      const afterTaskProgressEntity =
        beforeTaskProgressEntity.changeTaskStatus(afterTaskStatus)

      mockTaskProgressRepository.findByTaskProgressId.mockResolvedValueOnce(
        beforeTaskProgressEntity,
      )

      // Act
      await patchTaskProgressDataUseCase.do(
        taskProgressId.value,
        afterTaskStatus,
      )

      // Assert
      expect(mockTaskProgressRepository.save).toHaveBeenCalledWith(
        afterTaskProgressEntity,
      )
    })
  })
})
