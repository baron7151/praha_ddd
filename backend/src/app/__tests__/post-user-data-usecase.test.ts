import { UserEntity, UserStatus } from 'src/domain/user/user-entity'
import { UserFactory } from 'src/domain/user/user-factory'
import { IUserRepository } from 'src/domain/user/user-repository'
import { PostUserDataUseCase } from '../post-user-data-usecase'
import { uuid } from 'uuidv4'
import { mockUserRepository } from '@testUtil/mock/infra/repository/user-data-repository.mock'
import { UserDataDTO } from 'src/domain/user/user-dto'
import { UserData } from 'src/controller/response/get-user-data-response'

describe('PostUserDataUseCase', () => {
  const mockUserFactory = new UserFactory(mockUserRepository)
  const postUserDataUseCase = new PostUserDataUseCase(
    mockUserFactory,
    mockUserRepository,
  )

  beforeEach(() => {})

  it('should create a new user and save it', async () => {
    // テストデータ
    const userId = uuid()
    const userName = 'test1'
    const email = 'test1@example.com'
    const userEntity = UserFactory.create(
      userId,
      userName,
      email,
      UserStatus.ACTIVE,
    )
    // モック関数の動作を設定
    mockUserFactory.addUser = jest.fn().mockResolvedValue(userEntity)
    mockUserRepository.save = jest.fn().mockResolvedValue(Promise<void>)

    // ユーザデータの作成と保存を実行
    await postUserDataUseCase.do(userName, email)

    // モック関数が呼ばれたことを検証
    expect(mockUserFactory.addUser).toHaveBeenCalledWith(userName, email)
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.any(UserDataDTO),
    )
  })

  it('should throw an error when there is a database error', async () => {
    // テストデータ
    const userId = uuid()
    const userName = 'test1'
    const email = 'test1@example.com'
    const userEntity = UserFactory.create(
      userId,
      userName,
      email,
      UserStatus.ACTIVE,
    )

    // モック関数の動作を設定
    mockUserFactory.addUser = jest.fn().mockResolvedValue(userEntity)
    mockUserRepository.save = jest
      .fn()
      .mockRejectedValue(new Error('Database error.'))

    // エラーがスローされることを検証
    await expect(postUserDataUseCase.do(userName, email)).rejects.toThrowError()

    // モック関数が呼ばれたことを検証
    expect(mockUserFactory.addUser).toHaveBeenCalledWith(userName, email)
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.any(UserDataDTO),
    )
  })
})
