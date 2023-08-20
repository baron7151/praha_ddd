import { Module } from '@nestjs/common'
import { SampleController } from './controller/sample/some-data.controller'
import { UserController } from './controller/user.controller'
import { UserDataQS } from './infra/db/query-service/user-data-qs'
import { GetUserDataUseCase } from './app/user/get-user-data-usecase'
import { Providers } from './providers'
import { UserRepository } from './infra/db/repository/user-repository'
import { UserFactory } from './domain/user/user-factory'
import { PostUserDataUseCase } from './app/user/post-user-data-usecase'
import { PatchUserDataUseCase } from './app/user/patch-user-data-usecase'
import { PairRepository } from './infra/db/repository/pair-repository'
import { PairDataQS } from './infra/db/query-service/pair-data-qs'
import { PairController } from './controller/pair.controller'
import { GetPairDataUseCase } from './app/pair/get-pair-data-usecase'
import { PatchPairDataUseCase } from './app/pair/patch-pair-data-usecase'
import { GetTeamDataUseCase } from './app/team/get-team-data-usecase'
import { TeamDataQS } from './infra/db/query-service/team-data-qs'
import { TeamController } from './controller/team.controller'
import { PatchTeamDataUseCase } from './app/team/patch-team-data-usecase'
import { TeamRepository } from './infra/db/repository/team-repository'
import { TaskProgressRepository } from './infra/db/repository/task-progress-repository'
import { GetTaskProgressDataResponse } from './controller/response/get-task-progress-data-response'
import { GetTaskProgressDataUseCase } from './app/task-progress/get-task-progress-data-usecase'
import { TaskProgressController } from './controller/task-progress.controller'
import { DebugController } from './controller/debug.controller'
import { TaskProgressDataQS } from './infra/db/query-service/task-progress-data-qs'
import { PatchTaskProgressDataUseCase } from './app/task-progress/patch-task-progress-data-usecase'
import { PairFactory } from './domain/pair/pair-factory'

@Module({
  imports: [],
  controllers: [
    SampleController,
    UserController,
    PairController,
    TeamController,
    TaskProgressController,
    DebugController,
  ],
  providers: [
    {
      provide: Providers.IUserDataQS,
      useClass: UserDataQS,
    },
    {
      provide: Providers.IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: Providers.IPairRepository,
      useClass: PairRepository,
    },
    {
      provide: Providers.IPairDataQS,
      useClass: PairDataQS,
    },
    {
      provide: Providers.ITeamDataQS,
      useClass: TeamDataQS,
    },
    {
      provide: Providers.ITaskProgressRepository,
      useClass: TaskProgressRepository,
    },
    {
      provide: Providers.ITaskProgressDataQS,
      useClass: TaskProgressDataQS,
    },
    { provide: Providers.ITeamRepository, useClass: TeamRepository },
    GetUserDataUseCase,
    UserFactory,
    PostUserDataUseCase,
    PatchUserDataUseCase,
    GetPairDataUseCase,
    PatchPairDataUseCase,
    GetTeamDataUseCase,
    PatchTeamDataUseCase,
    GetTaskProgressDataUseCase,
    PatchTaskProgressDataUseCase,
    PairFactory,
  ],
})
export class AppModule {}
