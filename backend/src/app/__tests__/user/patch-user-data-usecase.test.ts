import { Providers } from 'src/providers'

import { UserEntity, UserId, UserStatus } from 'src/domain/user/user-entity'
import { uuid } from 'uuidv4'
import {
  mockPairRepository,
  mockTeamRepository,
  mockUserRepository,
} from '@testUtil/mock/infra/repository/repository.mock'
import { UserFactory } from 'src/domain/user/user-factory'
import { PatchUserDataUseCase } from 'src/app/user/patch-user-data-usecase'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamId } from 'src/domain/team/team-entity'
import { PairService } from 'src/domain/pair/pair-service'
import { TeamService } from 'src/domain/team/team-service'
import { before } from 'node:test'
describe('PatchUserDataUseCase', () => {
  let mockUserFactory = new UserFactory(mockUserRepository)
  let mockPairService = new PairService(mockPairRepository)
  let mockTeamService = new TeamService(mockTeamRepository)

  const patchUserDataUseCase = new PatchUserDataUseCase(
    mockUserRepository,
    mockUserFactory,
    mockTeamRepository,
    mockPairRepository,
    mockPairService,
    mockTeamService,
  )
  const beforeUserData = {
    userId: new UserId().value,
    userName: 'test1',
    email: 'test1@example.com',
    status: UserStatus.ACTIVE,
    pairId: new PairId().value,
    teamId: new TeamId().value,
  }
  const beforeUserEntity = UserFactory.create(beforeUserData)
  beforeEach(() => {})
  describe('do', () => {
    it('should update user data when user exists', async () => {
      // テストデータ
      const updateUserData = {
        userId: beforeUserData.userId,
        userName: 'test2',
        email: 'test2@example.com',
        status: UserStatus.INACTIVE,
      }
      const updateUserEntity = UserFactory.create(updateUserData)
      const updateStatusUserData = {
        userId: beforeUserData.userId,
        userName: beforeUserData.userName,
        email: beforeUserData.email,
        status: UserStatus.INACTIVE,
      }
      const updateStatusUserEntity = UserFactory.create(updateStatusUserData)

      // モック関数の動作を設定
      mockUserRepository.findByUserId = jest
        .fn()
        .mockImplementationOnce(() => beforeUserEntity)
        .mockImplementationOnce(() => updateStatusUserEntity)
      patchUserDataUseCase.saveChangeUserStatus = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)
      mockUserFactory.reconstruct = jest
        .fn()
        .mockResolvedValue(updateUserEntity)
      mockUserRepository.save = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)

      // ユーザデータの更新を実行
      await patchUserDataUseCase.do(updateUserData)

      // モック関数が呼ばれたことを検証
      expect(patchUserDataUseCase.saveChangeUserStatus).toHaveBeenCalledWith(
        beforeUserEntity,
        'INACTIVE',
      )
      expect(mockUserFactory.reconstruct).toHaveBeenCalledWith({
        userEntity: beforeUserEntity
          .changeStatus(UserStatus.INACTIVE)
          .changePair(undefined)
          .changeTeam(undefined),
        newUserName: updateUserData.userName,
        newEmail: updateUserData.email,
      })
      expect(mockUserRepository.save).toHaveBeenCalledWith(updateUserEntity)
    })
    // it('should throw an error when user does not exist', async () => {
    //   // テストデータ
    //   const userId = uuid()
    //   const testUser = {
    //     userId: userId,
    //     userName: 'test1',
    //     email: 'test1@example.com',
    //     status: UserStatus.ACTIVE,
    //   }
    //   const userData = UserFactory.create(testUser)
    //   const updateUserData = {
    //     userId: userId,
    //     email: 'test2@example.com',
    //     userName: 'test2',
    //     status: UserStatus.INACTIVE,
    //   }

    //   // モック関数の動作を設定
    //   mockUserRepository.findByUserId = jest
    //     .fn()
    //     .mockResolvedValue(Promise.resolve(undefined))

    //   // エラーがスローされることを検証
    //   await expect(
    //     patchUserDataUseCase.do(updateUserData),
    //   ).rejects.toThrowError('Not Found.')
    // })
  })
})
