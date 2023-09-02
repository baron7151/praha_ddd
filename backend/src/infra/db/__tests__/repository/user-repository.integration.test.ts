import { Email } from 'src/domain/common/email'
import {
  UserEntity,
  UserId,
  UserName,
  UserStatus,
} from 'src/domain/user/user-entity'
import { UserRepository } from '../../repository/user-repository'
import { uuid } from 'uuidv4'
import {
  cleaningAllTables,
  seedsTransfer,
  testPairData,
  testTeamData,
  testUserData,
} from '@testUtil/initial_data/seed'
import { TeamId } from 'src/domain/team/team-entity'
import { PairId } from 'src/domain/pair/pair-entity'

// テストコード
describe('UserRepository', () => {
  const userId = new UserId()
  const userName = new UserName('test100')
  const email = new Email('test100@example.com')
  const status = UserStatus.ACTIVE
  const pairId = new PairId(testPairData[0]?.pairId)
  const teamId = new TeamId(testTeamData[0]?.teamId)
  const user = new UserEntity(userId, userName, email, status, pairId, teamId)
  let userRepository = new UserRepository()

  beforeEach(() => {})
  afterAll(async () => {
    await cleaningAllTables()
  })
  beforeAll(async () => {
    await cleaningAllTables()
    await seedsTransfer()
  })

  afterEach(() => {
    // テスト後にデータをクリーンアップするなどの処理があれば記述
  })

  test('saveメソッドが正常に動作すること(create)', async () => {
    // テストに必要なデータを作成

    // saveメソッドを実行
    await userRepository.save(user)
    const result = await userRepository.findByUserId(userId)
    expect(result!.getAllProperties()).toEqual(user.getAllProperties())
    // 保存されたデータを検証するなどの処理を記述
  })
  test('saveメソッドが正常に動作すること(update)', async () => {
    // テストに必要なデータを作成
    const updateUserName = new UserName('yamada')
    const updateUser = new UserEntity(userId, updateUserName, email, status)
    // saveメソッドを実行
    await userRepository.save(updateUser)
    const result = await userRepository.findByUserId(userId)
    expect(result!.getAllProperties()).toEqual(updateUser.getAllProperties())
  })

  test('findメソッドが検索条件にUserID指定して正常に動作すること', async () => {
    // findメソッドを実行
    const result = await userRepository.findByUserId(userId)
    const resultAllProperties = result?.getAllProperties()
    expect(resultAllProperties?.userId.value).toBe(userId.value)
  })

  test('findメソッドが検索条件にEmailを指定して正常に動作すること', async () => {
    // findメソッドを実行
    const result = await userRepository.findByEmail(email)
    const resultAllProperties = result?.getAllProperties()
    expect(resultAllProperties?.userId.value).toBe(userId.value)
  })

  test('existsメソッドが正常に動作すること', async () => {
    // テストに必要なデータを作成
    const result = await userRepository.exists(email)
    expect(result).toBe(true)
  })
  describe('test findByTeamId()', () => {
    it('sholud return UserEntities', async () => {
      const teamId = new TeamId(testTeamData[0]?.teamId)
      const result = await userRepository.findByTeamId(teamId)

      result!.forEach((userEntity) =>
        expect(userEntity.getAllProperties().teamId).toEqual(teamId),
      )
    })
  })
  describe('test findByPairId()', () => {
    it('sholud return UserEntities', async () => {
      const pairId = new PairId(testPairData[0]?.pairId)
      const result = await userRepository.findByPairId(pairId)

      result!.forEach((userEntity) =>
        expect(userEntity.getAllProperties().pairId).toEqual(pairId),
      )
    })
  })
  describe('test findByManyUserIds()', () => {
    it('sholud return UserEntities', async () => {
      const userId1 = new UserId(testUserData[0]?.userId)
      const userId2 = new UserId(testUserData[1]?.userId)
      const userIds = [userId1, userId2]
      const result = await userRepository.findByManyUserIds(userIds)
      expect(result?.length).toBe(userIds.length)
    })
  })
})
