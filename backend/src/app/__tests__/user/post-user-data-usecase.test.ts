import { UserEntity, UserStatus } from 'src/domain/user/user-entity'
import { UserFactory } from 'src/domain/user/user-factory'
import { IUserRepository } from 'src/domain/user/user-repository'

import { uuid } from 'uuidv4'
import { mockUserRepository } from '@testUtil/mock/infra/repository/repository.mock'
import { PostUserDataUseCase } from 'src/app/user/post-user-data-usecase'

describe('PostUserDataUseCase', () => {
  const mockUserFactory = new UserFactory(mockUserRepository)
  const postUserDataUseCase = new PostUserDataUseCase(
    mockUserFactory,
    mockUserRepository,
  )
  const testUser1 = {
    userId: uuid(),
    userName: 'test1',
    email: 'test1@example.com',
    status: UserStatus.ACTIVE,
  }

  beforeEach(() => {})

  it('should create a new user and save it', async () => {
    // テストデータ
    const userEntity = UserFactory.create(testUser1)
    // モック関数の動作を設定
    mockUserFactory.addUser = jest.fn().mockResolvedValue(userEntity)
    mockUserRepository.save = jest.fn().mockResolvedValue(Promise<void>)

    // ユーザデータの作成と保存を実行
    await postUserDataUseCase.do(testUser1.userName, testUser1.email)

    // モック関数が呼ばれたことを検証
    expect(mockUserFactory.addUser).toHaveBeenCalledWith(
      testUser1.userName,
      testUser1.email,
    )
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(UserEntity))
  })

  it('should throw an error when there is a database error', async () => {
    // テストデータ
    const userEntity = UserFactory.create(testUser1)

    // モック関数の動作を設定
    mockUserFactory.addUser = jest.fn().mockResolvedValue(userEntity)
    mockUserRepository.save = jest
      .fn()
      .mockRejectedValue(new Error('Database error.'))

    // エラーがスローされることを検証
    await expect(
      postUserDataUseCase.do(testUser1.userName, testUser1.email),
    ).rejects.toThrowError()

    // モック関数が呼ばれたことを検証
    expect(mockUserFactory.addUser).toHaveBeenCalledWith(
      testUser1.userName,
      testUser1.email,
    )
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(UserEntity))
  })
})
