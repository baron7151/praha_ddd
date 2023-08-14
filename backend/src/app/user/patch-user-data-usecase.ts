import { Injectable, Inject } from '@nestjs/common'
import { TeamName } from 'src/domain/team/team-entity'
import { UserId } from 'src/domain/user/user-entity'
import { UserFactory } from 'src/domain/user/user-factory'
import { IUserRepository } from 'src/domain/user/user-repository'
import { Providers } from 'src/providers'
@Injectable()
export class PatchUserDataUseCase {
  public constructor(
    @Inject(Providers.IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(UserFactory) private readonly userFactory: UserFactory,
  ) {}
  public async do(data: {
    userId: string
    userName?: string
    email?: string
    status?: string
    pairId?: string
    teamId?: string
  }): Promise<void> {
    const { userId, email, userName, status, pairId, teamId } = data
    const userEntity = await this.userRepository.findByUserId(
      new UserId(userId),
    )
    if (userEntity !== undefined) {
      const newUserEntity = await this.userFactory.reconstruct({
        userEntity: userEntity,
        newUserName: userName,
        newEmail: email,
        newStatus: status,
        newPairId: pairId,
        newTeamId: teamId,
      })
      await this.userRepository.save(newUserEntity)
    } else {
      throw new Error('Not Found.')
    }
  }
}
