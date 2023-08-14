import { prisma } from 'src/prisma'

describe('prism全般に関するテスト', () => {
  beforeAll(async () => {
    await prisma.someData.deleteMany()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
  describe('基本的なcrud機能', () => {
    afterEach(async () => {
      await prisma.someData.deleteMany()
    })
    it('DBに追加できる', async () => {
      await prisma.someData.create({
        data: {
          id: '1',
          required: true,
          number: 4,
        },
      })
      const allSomeData = await prisma.someData.findMany()
      expect(allSomeData).toHaveLength(1)
    })
  })
})
