import { Providers } from 'src/providers'
import { PatchUserDataUseCase } from '../patch-user-data-usecase'
import { UserEntity, UserStatus } from 'src/domain/user/user-entity'
import { uuid } from 'uuidv4'
import { mockUserRepository } from '@testUtil/mock/infra/repository/user-data-repository.mock'
import { UserFactory } from 'src/domain/user/user-factory'
import { UserDataDTO } from 'src/domain/user/user-dto'
describe('PatchUserDataUseCase', () => {
  const patchUserDataUseCase = new PatchUserDataUseCase(mockUserRepository)

  beforeEach(() => {})
  describe('do', () => {
    it('should update user data when user exists', async () => {
      // テストデータ
      const userId = uuid()
      const userData = new UserDataDTO({
        userId: userId,
        userName: 'test1',
        email: 'test1@example.com',
        status: UserStatus.ACTIVE,
      })

      const updateUserData = {
        userId: userId,
        email: 'test2@example.com',
        userName: 'test2',
        status: UserStatus.INACTIVE,
      }
      const newUserData = new UserDataDTO({
        ...userData,
        userName: updateUserData.userName,
        email: updateUserData.email,
        status: updateUserData.status,
      })
      // モック関数の動作を設定
      mockUserRepository.findByUserId = jest.fn().mockResolvedValue(userData)
      mockUserRepository.update = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)

      // ユーザデータの更新を実行
      await patchUserDataUseCase.do(updateUserData)

      // モック関数が呼ばれたことを検証
      expect(mockUserRepository.findByUserId).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        newUserData,
        userId,
      )
    })
    it('should throw an error when user does not exist', async () => {
      // テストデータ
      const userId = uuid()
      const userData = UserFactory.create(
        userId,
        'test1',
        'test1@example.com',
        UserStatus.ACTIVE,
      )
      const updateUserData = {
        userId: userId,
        email: 'test2@example.com',
        userName: 'test2',
        status: UserStatus.INACTIVE,
      }

      // モック関数の動作を設定
      mockUserRepository.findByUserId = jest
        .fn()
        .mockResolvedValue(Promise.resolve(undefined))

      // エラーがスローされることを検証
      await expect(
        patchUserDataUseCase.do(updateUserData),
      ).rejects.toThrowError('Not Found.')
    })
  })
})
