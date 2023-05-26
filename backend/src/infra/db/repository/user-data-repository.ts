import { PrismaClient } from '@prisma/client'
import { SomeData } from 'src/domain/some-data/some-data'
import { UserEntity } from 'src/domain/user/user-entity'
import { IUserRepository } from 'src/domain/user/user-repository'

export class SomeDataRepository implements IUserRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async save(user: UserEntity): Promise<UserEntity> {
    const { userId, userName, email, pairId, teamId } = user.getAllProperties()

    const savedSomeDataDatamodel = await this.prismaClient.someData.create({
      data: {
        id,
        required,
        number,
      },
    })
    const savedSomeDataEntity = new SomeData({
      ...savedSomeDataDatamodel,
    })
    return savedSomeDataEntity
  }
}
