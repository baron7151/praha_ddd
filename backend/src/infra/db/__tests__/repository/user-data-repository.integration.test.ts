import { Email } from 'src/domain/common/email'
import { UserEntity, UserName, UserStatus } from 'src/domain/user/user-entity'
import { UserDataRepository } from '../../repository/user-data-repository'
import prisma from '../../client/prisma-clilent'
import { uuid } from 'uuidv4'
import { TaskProgressId } from 'src/domain/task/task-progress-entity'
import { PairId } from 'src/domain/pair/pair-entity'
import { TeamId } from 'src/domain/team/team-entity'
import { UserDataDTO } from 'src/domain/user/user-dto'

// テストコード
describe('UserDataRepository', () => {
  let repository: UserDataRepository
  const userId = uuid()
  const userName = 'test1'
  const email = 'test1@example.com'
  const status = UserStatus.ACTIVE
  const pairId = uuid()
  const teamId = uuid()
  const taskProgressId = uuid()

  const user = new UserDataDTO({
    userId,
    userName,
    email,
    status,
    pairId,
    teamId,
    taskProgressId,
  })

  beforeEach(() => {
    repository = new UserDataRepository()
  })
  afterAll(async () => {
    await prisma.user.deleteMany({})
  })

  afterEach(() => {
    // テスト後にデータをクリーンアップするなどの処理があれば記述
  })

  test('saveメソッドが正常に動作すること', async () => {
    // テストに必要なデータを作成

    // saveメソッドを実行
    await repository.save(user)

    // 保存されたデータを検証するなどの処理を記述
  })

  test('findメソッドが検索条件にUserID指定して正常に動作すること', async () => {
    // findメソッドを実行
    const result = await repository.findByUserId(userId)
    expect(result?.userId).toBe(userId)
  })

  test('findメソッドが検索条件にEmailを指定して正常に動作すること', async () => {
    // findメソッドを実行
    const result = await repository.findByEmail(email)
    expect(result?.userId).toBe(userId)
  })

  test('existsメソッドが正常に動作すること', async () => {
    // テストに必要なデータを作成
    const result = await repository.exists(email)
    expect(result).toBe(true)
  })

  test('updateメソッドが正常に動作すること', async () => {
    const updateUserName = 'test2'
    const updateEmail = 'test2@example.com'
    const updateUserStatus = UserStatus.INACTIVE

    const updateUser = new UserDataDTO({
      userId: userId,
      userName: updateUserName,
      email: updateEmail,
      status: updateUserStatus,
    })
    await repository.update(updateUser, userId)
    const result = await repository.findByUserId(userId)
    expect(result?.email).toBe(updateEmail)
    expect(result?.userName).toBe(updateUserName)
    expect(result?.status).toBe(UserStatus.INACTIVE)
  })
})
