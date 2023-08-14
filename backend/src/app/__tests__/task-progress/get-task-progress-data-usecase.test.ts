import {
  ITaskProgressDataQS,
  TaskProgressDataDTO,
} from 'src/app/query-service-interface/task-progress-data-qs'
import { GetTaskProgressDataUseCase } from 'src/app/task-progress/get-task-progress-data-usecase'
import { TaskStatus } from 'src/domain/task-progress/task-progress-entity'
import { uuid } from 'uuidv4'

describe('get-task-progress-data-usecase', () => {
  let taskProgressDataQS: ITaskProgressDataQS
  let getTaskProgressDataUseCase: GetTaskProgressDataUseCase

  beforeAll(() => {
    taskProgressDataQS = {
      getTaskProgress: jest.fn(),
    }
    getTaskProgressDataUseCase = new GetTaskProgressDataUseCase(
      taskProgressDataQS,
    )
  })

  beforeEach(() => {})

  describe('do', () => {
    it('should return the result from TaskProgress', async () => {
      const expectedTaskProgress = [
        new TaskProgressDataDTO({
          taskProgressId: uuid(),
          taskId: uuid(),
          userId: uuid(),
          userName: 'test1',
          taskName: 'Modeling',
          taskStatus: TaskStatus.COMPLETED,
          taskCategory: 'DB1',
        }),
        new TaskProgressDataDTO({
          taskProgressId: uuid(),
          taskId: uuid(),
          userId: uuid(),
          userName: 'test2',
          taskName: 'Modeling',
          taskStatus: TaskStatus.COMPLETED,
          taskCategory: 'DB2',
        }),
      ]
      taskProgressDataQS.getTaskProgress = jest
        .fn()
        .mockResolvedValue(expectedTaskProgress)

      // Act
      const result = await getTaskProgressDataUseCase.do(
        2,
        0,
        '',
        'Modeling',
        TaskStatus.COMPLETED,
      )

      // Assert
      expect(result).toEqual(expectedTaskProgress)
    })
  })
})
