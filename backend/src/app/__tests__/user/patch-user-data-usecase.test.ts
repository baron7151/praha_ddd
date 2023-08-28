import { Providers } from 'src/providers'

import {
  UserEntity,
  UserId,
  UserName,
  UserStatus,
} from 'src/domain/user/user-entity'
import { uuid } from 'uuidv4'
import {
  mockPairRepository,
  mockTeamRepository,
  mockUserRepository,
} from '@testUtil/mock/infra/repository/repository.mock'
import { UserFactory } from 'src/domain/user/user-factory'
import { PatchUserDataUseCase } from 'src/app/user/patch-user-data-usecase'
import { PairEntity, PairId, PairName } from 'src/domain/pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from 'src/domain/team/team-entity'
import { PairService } from 'src/domain/pair/pair-service'
import { TeamService } from 'src/domain/team/team-service'
import { before, mock } from 'node:test'
import { Email } from 'src/domain/common/email'
import { UserService } from 'src/domain/user/user-service'
import { de } from '@faker-js/faker'
describe('PatchUserDataUseCase', () => {
  // let mockUserFactory = new UserFactory(mockUserRepository)
  // let mockPairService = new PairService(mockPairRepository)
  // let mockTeamService = new TeamService(mockTeamRepository)
  const mockPairService = {
    findMostFewMemberPairByTeamId: jest.fn(),
    autoPairCreate: jest.fn(),
  }
  const mockTeamService = {
    findMostFewMemberTeam: jest.fn(),
  }
  const mockUserFactory = {
    reconstruct: jest.fn(),
  }

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

      mockUserFactory.reconstruct = jest
        .fn()
        .mockResolvedValue(updateUserEntity)
      mockUserRepository.save = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)
      const patchUserDataUseCase = new PatchUserDataUseCase(
        mockUserRepository,
        mockUserFactory as any,
        mockTeamRepository,
        mockPairRepository,
        mockPairService as any,
        mockTeamService as any,
      )
      patchUserDataUseCase.saveChangeUserStatus = jest
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
  })
  describe('saveChangeUserStatus', () => {
    it('Change the user status to active, create a new pair and move user to the pair.', async () => {
      const userData = {
        userId: new UserId().value,
        userName: 'test1',
        email: 'test1@example.com',
        status: UserStatus.INACTIVE,
      }
      const user = UserFactory.create(userData)
      const updateUserData = {
        userId: userData.userId,
        userName: 'test1',
        email: 'test1@example.com',
        status: UserStatus.ACTIVE,
      }
      const teamId = new TeamId()
      const pairId = new PairId()
      const teamName = new TeamName('1')
      const pairIds = [pairId, new PairId()]
      const userIds = [
        new UserId(),
        new UserId(),
        new UserId(),
        new UserId(),
        new UserId(),
      ]
      const mostFewMemberTeam = new TeamEntity(
        teamId,
        teamName,
        pairIds,
        userIds,
      )
      const pairName = new PairName('a')
      const pair = new PairEntity(pairId, pairName, teamId, [
        userIds[0] as UserId,
        userIds[1] as UserId,
        userIds[2] as UserId,
      ])
      const updateUserEntity = UserFactory.create(updateUserData)
      mockTeamService.findMostFewMemberTeam = jest
        .fn()
        .mockResolvedValueOnce(mostFewMemberTeam)
      mockPairService.findMostFewMemberPairByTeamId = jest
        .fn()
        .mockResolvedValueOnce(pair)
      const newPairId = new PairId()
      const newPairName = new PairName('b')
      const newPair = new PairEntity(newPairId, newPairName)
      mockPairService.autoPairCreate = jest.fn().mockResolvedValueOnce(newPair)
      mockPairRepository.save = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)
      const moveUserId = userIds[0] as UserId
      const moveUser = new UserEntity(
        moveUserId,
        new UserName('test10'),
        new Email('test10@example.com'),
        UserStatus.ACTIVE,
      )
      mockUserRepository.findByUserId = jest
        .fn()
        .mockResolvedValueOnce(moveUser)
      const patchUserDataUseCase = new PatchUserDataUseCase(
        mockUserRepository,
        mockUserFactory as any,
        mockTeamRepository,
        mockPairRepository,
        mockPairService as any,
        mockTeamService as any,
      )
      await patchUserDataUseCase.saveChangeUserStatus(user, UserStatus.ACTIVE)
      //await patchUserDataUseCase.saveChangeUserStatus(user, UserStatus.INACTIVE)
      expect(mockTeamService.findMostFewMemberTeam).toHaveBeenCalled()
      expect(
        mockPairService.findMostFewMemberPairByTeamId,
      ).toHaveBeenCalledWith(mostFewMemberTeam.getId())
      expect(mockPairService.autoPairCreate).toHaveBeenCalled()
      expect(mockUserRepository.findByUserId).toHaveBeenCalled()
      expect(mockUserRepository.save).toBeCalledTimes(3)
    })
    it('Change the user status to active and move user to moveable pair.', async () => {
      const userData = {
        userId: new UserId().value,
        userName: 'test1',
        email: 'test1@example.com',
        status: UserStatus.INACTIVE,
      }
      const user = UserFactory.create(userData)
      const teamId = new TeamId()
      const pairId = new PairId()
      const teamName = new TeamName('1')
      const pairIds = [pairId, new PairId()]
      const userIds = [
        new UserId(),
        new UserId(),
        new UserId(),
        new UserId(),
        new UserId(),
      ]
      const updateUserData = {
        userId: userData.userId,
        userName: 'test1',
        email: 'test1@example.com',
        status: UserStatus.ACTIVE,
        pairId: pairId.value,
        teamId: teamId.value,
      }
      const updateUserEntity = UserFactory.create(updateUserData)
      const mostFewMemberTeam = new TeamEntity(
        teamId,
        teamName,
        pairIds,
        userIds,
      )
      const pairName = new PairName('a')
      const mostFewMemberPair = new PairEntity(pairId, pairName, teamId, [
        userIds[0] as UserId,
        userIds[1] as UserId,
      ])

      mockTeamService.findMostFewMemberTeam = jest
        .fn()
        .mockResolvedValueOnce(mostFewMemberTeam)
      mockPairService.findMostFewMemberPairByTeamId = jest
        .fn()
        .mockResolvedValueOnce(mostFewMemberPair)

      mockPairRepository.save = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)

      const patchUserDataUseCase = new PatchUserDataUseCase(
        mockUserRepository,
        mockUserFactory as any,
        mockTeamRepository,
        mockPairRepository,
        mockPairService as any,
        mockTeamService as any,
      )
      await patchUserDataUseCase.saveChangeUserStatus(user, UserStatus.ACTIVE)
      //await patchUserDataUseCase.saveChangeUserStatus(user, UserStatus.INACTIVE)
      expect(mockTeamService.findMostFewMemberTeam).toHaveBeenCalled()
      expect(
        mockPairService.findMostFewMemberPairByTeamId,
      ).toHaveBeenCalledWith(mostFewMemberTeam.getId())
      expect(mockUserRepository.save).toHaveBeenCalledWith(updateUserEntity)
    })
    it('Change the user status to inactive.', async () => {
      const teamId = new TeamId()
      const pairId = new PairId()
      const teamName = new TeamName('1')
      const pairIds = [pairId]
      const userIds = [new UserId(), new UserId(), new UserId()]
      const team = new TeamEntity(teamId, teamName, pairIds, userIds)

      const userData = {
        userId: new UserId().value,
        userName: 'test1',
        email: 'test1@example.com',
        status: UserStatus.ACTIVE,
        pairId: pairId.value,
        teamId: teamId.value,
      }
      const user = UserFactory.create(userData)
      const updateUserData = {
        userId: userData.userId,
        userName: 'test1',
        email: 'test1@example.com',
        status: UserStatus.INACTIVE,
      }
      const updateUserEntity = UserFactory.create(updateUserData)

      mockTeamRepository.findByTeamId = jest.fn().mockResolvedValue(team)

      const user1 = new UserEntity(
        userIds[0] as UserId,
        new UserName('test1'),
        new Email('test1@example.com'),
        UserStatus.ACTIVE,
      )
      const user2 = new UserEntity(
        userIds[1] as UserId,
        new UserName('test2'),
        new Email('test2@example.com'),
        UserStatus.ACTIVE,
      )
      const user3 = new UserEntity(
        userIds[2] as UserId,
        new UserName('test3'),
        new Email('test3@example.com'),
        UserStatus.ACTIVE,
      )
      const userEntities = [user1, user2, user3]

      mockUserRepository.findByTeamId = jest
        .fn()
        .mockResolvedValue(userEntities)

      mockUserRepository.save = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)

      const patchUserDataUseCase = new PatchUserDataUseCase(
        mockUserRepository,
        mockUserFactory as any,
        mockTeamRepository,
        mockPairRepository,
        mockPairService as any,
        mockTeamService as any,
      )

      patchUserDataUseCase.movePairMemberWithPairMemberDecrease = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)

      await patchUserDataUseCase.saveChangeUserStatus(user, UserStatus.INACTIVE)

      expect(mockTeamRepository.findByTeamId).toHaveBeenCalledWith(teamId)
      expect(mockUserRepository.findByTeamId).toHaveBeenCalledWith(teamId)
      expect(
        patchUserDataUseCase.movePairMemberWithPairMemberDecrease,
      ).toBeCalledWith(pairId, new UserName(userData.userName))
      expect(mockUserRepository.save).toHaveBeenCalledWith(updateUserEntity)
    })
  })
  describe('test movePairMemberWithPairMemberDecrease', () => {
    it('move pair member with pair member decrease.', async () => {
      const moveUserPairId = new PairId()
      const moveUserTeamId = new TeamId()
      const moveUserIds = [new UserId(), new UserId()]
      const changeStatusUserName = new UserName('changeStatusUser')
      const moveUsers = [
        new UserEntity(
          moveUserIds[0] as UserId,
          new UserName('test1'),
          new Email('test1@example.com'),
          UserStatus.ACTIVE,
        ),
        new UserEntity(
          moveUserIds[1] as UserId,
          new UserName('test2'),
          new Email('test2@exmaple.com'),
          UserStatus.ACTIVE,
        ),
      ]

      const moveUserPair = new PairEntity(
        moveUserPairId,
        new PairName('a'),
        moveUserTeamId,
        moveUserIds,
      )
      mockPairRepository.findByPairId = jest
        .fn()
        .mockResolvedValue(moveUserPair)
      mockUserRepository.findByManyUserIds = jest
        .fn()
        .mockResolvedValue(moveUsers)

      let moveUserOtherPair = [
        new PairEntity(new PairId(), new PairName('b'), moveUserTeamId, [
          new UserId(),
          new UserId(),
        ]),
      ]
      mockPairRepository.findByTeamId = jest
        .fn()
        .mockResolvedValue(moveUserOtherPair)

      mockUserRepository.save = jest
        .fn()
        .mockResolvedValue(Promise.resolve<undefined>)
      const patchUserDataUseCase = new PatchUserDataUseCase(
        mockUserRepository,
        mockUserFactory as any,
        mockTeamRepository,
        mockPairRepository,
        mockPairService as any,
        mockTeamService as any,
      )

      await patchUserDataUseCase.movePairMemberWithPairMemberDecrease(
        moveUserPairId,
        changeStatusUserName,
      )
      expect(mockPairRepository.findByPairId).toHaveBeenCalledWith(
        moveUserPairId,
      )
      expect(mockUserRepository.findByManyUserIds).toHaveBeenCalledWith(
        moveUserIds,
      )
      expect(mockUserRepository.save).toHaveBeenCalledTimes(2)
    })
  })
})
