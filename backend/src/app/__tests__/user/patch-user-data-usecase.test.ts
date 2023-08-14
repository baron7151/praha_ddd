import { Providers } from 'src/providers'

import { UserEntity, UserId, UserStatus } from 'src/domain/user/user-entity'
import { uuid } from 'uuidv4'
import { mockUserRepository } from '@testUtil/mock/infra/repository/repository.mock'
import { UserFactory } from 'src/domain/user/user-factory'
import { PatchUserDataUseCase } from 'src/app/user/patch-user-data-usecase'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamId } from 'src/domain/team/team-entity'
describe('PatchUserDataUseCase', () => {
  const mockUserFactory = {
    addUser: jest.fn(),
    create: jest.fn(),
    reconstruct: jest.fn(),
  }
  const userFactory = new UserFactory(mockUserRepository)
  const patchUserDataUseCase = new PatchUserDataUseCase(
    mockUserRepository,
    userFactory,
  )
  const testUser1 = {
    userId: new UserId().value,
    userName: 'test1',
    email: 'test1@example.com',
    status: UserStatus.ACTIVE,
    pairId: new PairId().value,
    teamId: new TeamId().value,
  }
  beforeEach(() => {})
  describe('do', () => {
    it('should update user data when user exists', async () => {
      // テストデータ
      const userEntity = UserFactory.create(testUser1)
      const updateUserData = {
        userId: testUser1.userId,
        userName: 'test2',
        email: 'test2@example.com',
        status: UserStatus.ACTIVE,
        pairId: new PairId().value,
        teamId: new TeamId().value,
      }

      const newUserEntity = UserFactory.create({
        userId: testUser1.userId,
        userName: updateUserData.userName,
        email: updateUserData.email,
        status: updateUserData.status,
        pairId: updateUserData.pairId,
        teamId: updateUserData.teamId,
      })
      // モック関数の動作を設定
      mockUserRepository.findByUserId = jest.fn().mockResolvedValue(userEntity)
      mockUserRepository.save = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)
      userFactory.reconstruct = jest.fn().mockResolvedValue(newUserEntity)

      // ユーザデータの更新を実行
      await patchUserDataUseCase.do(updateUserData)

      // モック関数が呼ばれたことを検証
      expect(mockUserRepository.findByUserId).toHaveBeenCalledWith(
        new UserId(testUser1.userId),
      )
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUserEntity)
    })
    it('should throw an error when user does not exist', async () => {
      // テストデータ
      const userId = uuid()
      const testUser = {
        userId: userId,
        userName: 'test1',
        email: 'test1@example.com',
        status: UserStatus.ACTIVE,
      }
      const userData = UserFactory.create(testUser)
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
