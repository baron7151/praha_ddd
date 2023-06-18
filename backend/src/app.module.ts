import { Module } from '@nestjs/common'
import { SampleController } from './controller/sample/some-data.controller'
import { UserController } from './controller/user-data.controller'
import { UserDataQS } from './infra/db/query-service/user-data-qs'
import { GetUserDataUseCase } from './app/get-user-data-usecase'
import { Providers } from './providers'
import { UserDataRepository } from './infra/db/repository/user-data-repository'
import { UserFactory } from './domain/user/user-factory'
import { PostUserDataUseCase } from './app/post-user-data-usecase'
import { PatchUserDataUseCase } from './app/patch-user-data-usecase'

@Module({
  imports: [],
  controllers: [SampleController, UserController],
  providers: [
    {
      provide: Providers.IUserDataQS,
      useClass: UserDataQS,
    },
    {
      provide: Providers.IUserRepository,
      useClass: UserDataRepository,
    },
    GetUserDataUseCase,
    UserFactory,
    PostUserDataUseCase,
    PatchUserDataUseCase,
  ],
})
export class AppModule {}
