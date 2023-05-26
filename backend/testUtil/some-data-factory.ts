import { SomeData } from 'src/domain/some-data/some-data'
import { prisma } from '@testUtil/prisma'
import { faker } from '@faker-js/faker'

export const seedSomeData = async (params: {
  id?: string
  required?: boolean
  number?: number
}) => {
  const { id, required, number } = params
  const someDataEntity = new SomeData({
    id: id ?? faker.string.uuid(),
    required: required ?? true,
    number: number ?? 1,
  })
  await prisma.someData.create({
    data: {
      ...someDataEntity.getAllProperties(),
    },
  })
}
