import { Email } from 'src/domain/common/email'
import {
  UserEntity,
  UserId,
  UserName,
  UserStatus,
} from 'src/domain/user/user-entity'
import { UserDataRepository } from '../../repository/user-repository'

import { uuid } from 'uuidv4'

import { UserFactory } from 'src/domain/user/user-factory'
import { prisma } from 'src/prisma'

// テストコード
describe('UserDataRepository', () => {
  let repository: UserDataRepository
  const userId = new UserId(uuid())
  const userName = new UserName('test1')
  const email = new Email('test1@example.com')
  const status = UserStatus.ACTIVE

  const user = new UserEntity(userId, userName, email, status)

  beforeEach(() => {
    repository = new UserDataRepository()
  })
  afterAll(async () => {
    await prisma.user.deleteMany({})
    await prisma.$disconnect()
  })
  beforeAll(async () => {
    await prisma.user.deleteMany({})
  })

  afterEach(() => {
    // テスト後にデータをクリーンアップするなどの処理があれば記述
  })

  test('saveメソッドが正常に動作すること(create)', async () => {
    // テストに必要なデータを作成

    // saveメソッドを実行
    await repository.save(user)
    const result = await repository.findByUserId(userId)
    expect(result?.getAllProperties().userId.value).toBe(userId.value)
    // 保存されたデータを検証するなどの処理を記述
  })
  test('saveメソッドが正常に動作すること(update)', async () => {
    // テストに必要なデータを作成
    const updateUserName = new UserName('yamada')
    const updateUser = new UserEntity(userId, updateUserName, email, status)
    // saveメソッドを実行
    await repository.save(updateUser)
    const result = await repository.findByUserId(userId)
    expect(result?.getAllProperties().userId.value).toBe(userId.value)
    expect(result?.getAllProperties().userName.value).toBe(updateUserName.value)
  })

  test('findメソッドが検索条件にUserID指定して正常に動作すること', async () => {
    // findメソッドを実行
    const result = await repository.findByUserId(userId)
    const resultAllProperties = result?.getAllProperties()
    expect(resultAllProperties?.userId.value).toBe(userId.value)
  })

  test('findメソッドが検索条件にEmailを指定して正常に動作すること', async () => {
    // findメソッドを実行
    const result = await repository.findByEmail(email)
    const resultAllProperties = result?.getAllProperties()
    expect(resultAllProperties?.userId.value).toBe(userId.value)
  })

  test('existsメソッドが正常に動作すること', async () => {
    // テストに必要なデータを作成
    const result = await repository.exists(email)
    expect(result).toBe(true)
  })
})
