import { Injectable, Inject } from '@nestjs/common'
import { UserFactory } from 'src/domain/user/user-factory'
import { IUserRepository } from 'src/domain/user/user-repository'
import { Providers } from 'src/providers'
@Injectable()
export class PostUserDataUseCase {
  public constructor(
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @Inject(Providers.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}
  public async do(userName: string, email: string): Promise<void> {
    const userEntity = await this.userFactory.addUser(userName, email)
    await this.userRepository.save(userEntity)
  }
}
