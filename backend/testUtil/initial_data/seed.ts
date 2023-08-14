import { Prisma } from '@prisma/client'
import { TaskStatus } from 'src/domain/task-progress/task-progress-entity'
import { UserStatus } from 'src/domain/user/user-entity'
import { prisma } from 'src/prisma'
import { uuid } from 'uuidv4'

// モデル投入用のデータ定義

export const testUserData: Prisma.UserCreateInput[] = [
  {
    userId: uuid(),
    userName: 'test1',
    email: 'test1@example.com',
    status: UserStatus.ACTIVE,
  },
  {
    userId: uuid(),
    userName: 'test2',
    email: 'test2@example.com',
    status: UserStatus.ACTIVE,
  },
  {
    userId: uuid(),
    userName: 'test3',
    email: 'test3@example.com',
    status: UserStatus.ACTIVE,
  },
  {
    userId: uuid(),
    userName: 'test4',
    email: 'test4@example.com',
    status: UserStatus.ACTIVE,
  },
  {
    userId: uuid(),
    userName: 'test5',
    email: 'test5@example.com',
    status: UserStatus.ACTIVE,
  },
  {
    userId: uuid(),
    userName: 'test6',
    email: 'test6@example.com',
    status: UserStatus.ACTIVE,
  },
  {
    userId: uuid(),
    userName: 'test7',
    email: 'test7@example.com',
    status: UserStatus.ACTIVE,
  },
]

export const testPairData: Prisma.PairCreateInput[] = [
  {
    pairId: uuid(),
    pairName: 'A',
    user: {
      connect: [
        { userId: testUserData[0]?.userId },
        { userId: testUserData[1]?.userId },
      ],
    },
  },
  {
    pairId: uuid(),
    pairName: 'B',
    user: {
      connect: [
        { userId: testUserData[2]?.userId },
        { userId: testUserData[3]?.userId },
        { userId: testUserData[4]?.userId },
      ],
    },
  },
  {
    pairId: uuid(),
    pairName: 'C',
  },
]

export const testTeamData: Prisma.TeamCreateInput[] = [
  {
    teamId: uuid(),
    teamName: '1',
    pair: {
      connect: [
        { pairId: testPairData[0]?.pairId },
        { pairId: testPairData[1]?.pairId },
      ],
    },
    user: {
      connect: [
        { userId: testUserData[0]?.userId },
        { userId: testUserData[1]?.userId },
        { userId: testUserData[2]?.userId },
        { userId: testUserData[3]?.userId },
        { userId: testUserData[4]?.userId },
      ],
    },
  },
  {
    teamId: uuid(),
    teamName: '2',
  },
]

export const testTaskData: Prisma.TaskCreateInput[] = [
  {
    taskId: uuid(),
    taskName: 'DBモデリング1',
    taskContent: 'model1model1',
    taskCategory: 'DB設計',
  },
  {
    taskId: uuid(),
    taskName: 'DBモデリング2',
    taskContent: 'model2model2',
    taskCategory: 'DB設計',
  },
  {
    taskId: uuid(),
    taskName: '単体テスト1',
    taskContent: 'unit1unit1',
    taskCategory: 'テスト',
  },
  {
    taskId: uuid(),
    taskName: '単体テスト2',
    taskContent: 'unit2unit2',
    taskCategory: 'テスト',
  },
  {
    taskId: uuid(),
    taskName: 'TDD',
    taskContent: 'tdd1tdd1',
    taskCategory: '設計',
  },
]

export const testTaskProgressData: Prisma.TaskProgressCreateInput[] = [
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[0]?.taskId },
    },
    user: {
      connect: { userId: testUserData[0]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[1]?.taskId },
    },
    user: {
      connect: { userId: testUserData[0]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[2]?.taskId },
    },
    user: {
      connect: { userId: testUserData[0]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[3]?.taskId },
    },
    user: {
      connect: { userId: testUserData[0]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[4]?.taskId },
    },
    user: {
      connect: { userId: testUserData[0]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[0]?.taskId },
    },
    user: {
      connect: { userId: testUserData[1]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[1]?.taskId },
    },
    user: {
      connect: { userId: testUserData[1]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.PROGRESS,
    task: {
      connect: { taskId: testTaskData[2]?.taskId },
    },
    user: {
      connect: { userId: testUserData[1]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[3]?.taskId },
    },
    user: {
      connect: { userId: testUserData[1]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[4]?.taskId },
    },
    user: {
      connect: { userId: testUserData[1]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[0]?.taskId },
    },
    user: {
      connect: { userId: testUserData[2]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[1]?.taskId },
    },
    user: {
      connect: { userId: testUserData[2]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[2]?.taskId },
    },
    user: {
      connect: { userId: testUserData[2]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[3]?.taskId },
    },
    user: {
      connect: { userId: testUserData[2]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[4]?.taskId },
    },
    user: {
      connect: { userId: testUserData[2]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[0]?.taskId },
    },
    user: {
      connect: { userId: testUserData[3]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[1]?.taskId },
    },
    user: {
      connect: { userId: testUserData[3]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[2]?.taskId },
    },
    user: {
      connect: { userId: testUserData[3]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[3]?.taskId },
    },
    user: {
      connect: { userId: testUserData[3]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[4]?.taskId },
    },
    user: {
      connect: { userId: testUserData[3]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[0]?.taskId },
    },
    user: {
      connect: { userId: testUserData[4]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[1]?.taskId },
    },
    user: {
      connect: { userId: testUserData[4]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[2]?.taskId },
    },
    user: {
      connect: { userId: testUserData[4]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[3]?.taskId },
    },
    user: {
      connect: { userId: testUserData[4]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[4]?.taskId },
    },
    user: {
      connect: { userId: testUserData[4]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[0]?.taskId },
    },
    user: {
      connect: { userId: testUserData[5]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[1]?.taskId },
    },
    user: {
      connect: { userId: testUserData[5]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[2]?.taskId },
    },
    user: {
      connect: { userId: testUserData[5]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[3]?.taskId },
    },
    user: {
      connect: { userId: testUserData[5]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.NOT_STARTED,
    task: {
      connect: { taskId: testTaskData[4]?.taskId },
    },
    user: {
      connect: { userId: testUserData[5]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[0]?.taskId },
    },
    user: {
      connect: { userId: testUserData[6]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[1]?.taskId },
    },
    user: {
      connect: { userId: testUserData[6]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[2]?.taskId },
    },
    user: {
      connect: { userId: testUserData[6]?.userId },
    },
  },
  {
    taskProgressId: uuid(),
    taskStatus: TaskStatus.COMPLETED,
    task: {
      connect: { taskId: testTaskData[3]?.taskId },
    },
    user: {
      connect: { userId: testUserData[6]?.userId },
    },
  },
]

export const cleaningAllTables = async () => {
  await prisma.pair.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.taskProgress.deleteMany({})
  await prisma.task.deleteMany({})
}

// 定義されたデータを実際のモデルへ登録する処理
export const seedsTransfer = async () => {
  console.log(`Start seeding ...`)
  await prisma.$transaction(
    testUserData.map((d) => prisma.user.create({ data: d })),
  )
  await prisma.$transaction(
    testPairData.map((d) => prisma.pair.create({ data: d })),
  )

  await prisma.$transaction(
    testTeamData.map((d) => prisma.team.create({ data: d })),
  )

  await prisma.$transaction(
    testTaskData.map((d) => prisma.task.create({ data: d })),
  )

  await prisma.$transaction(
    testTaskProgressData.map((d) => prisma.taskProgress.create({ data: d })),
  )

  console.log(`Seeding finished.`)
}
